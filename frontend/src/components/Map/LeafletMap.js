import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, WMSTileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';

import useMapClick from './useMapClick';

const LeafletMap = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const timePeriod = useSelector((state) => state.timePeriod);
  const futureScenario = useSelector((state) => state.futureScenario);
  const variable = useSelector((state) => state.variable);
  const isMobile = useSelector((state) => state.isMobile);

  const variableKey = timePeriod.domain === 'historical' ? `${variable.id}_hist` : `${variable.id}_${futureScenario.id}_${timePeriod.id}`;

  const wmsUrl = `${process.env.REACT_APP_THREDDS_URL}/wms/cesamAll/${variable.domain}/${variableKey}.nc`;

  const handleTileLoading = (layer) => {
    layer.on('load', () => {
      setLoading(false);
    });
    layer.on('tileerror', (e) => {
      setLoading(false);
      setErrorMessage(t('noMapAvailable'));
    });
  };

  useEffect(() => {
    // setLoading(true);
    setErrorMessage(null);
  }, [variable, timePeriod]);


  return errorMessage ? (
    <div className="error-message-container">
      <MdErrorOutline size={28} style={{ marginBottom: '12px' }} />
      {errorMessage}
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      {loading && (
        <div className="loading-container">
          <div>{t('loadingMap')}</div>
          <div className="loading-icon" />
        </div>
      )}
      <MapContainer
        center={[39.6, -7.8]}
        zoom={7}
        minZoom={6}
        maxZoom={9}
        zoomControl={false}
        maxBounds={
          [
            [31.9, -13.5], // Southwest corner (latitude, longitude)
            [47.3, -3.0], // Northeast corner
          ]
        }
        maxBoundsViscosity={0.5} // map bounce back into place if dragged outside
        // dragging={!isMobile} //* test on mobile to see if it's necessary
        style={{ height: !isMobile ? '100%' : '650px', width: '100%' }}
        key={variableKey}
        doubleClickZoom={false}
      >
        <MapContent wmsUrl={wmsUrl}
          variable={variable}
          variableKey={variableKey}
          handleTileLoading={handleTileLoading}
          loading={loading}
          t={t}
          isMobile={isMobile}
        />
      </MapContainer>
      {/* div with a tip text */}
      <div style={{ width: '100%', color: '#2c2c36', margin: '10px', fontSize: '11px' }}>
        {t('mapTip')}
      </div>
    </div>
  );
};

const MapContent = ({ wmsUrl, variable, variableKey, handleTileLoading, loading, t, isMobile }) => {

  useMapClick(wmsUrl, variable, variableKey);

  return (
    <>
      <WMSTileLayer
        url={wmsUrl}
        layers={variableKey}
        styles="default"
        format="image/png"
        transparent={true}
        version="1.3.0"
        tileSize={512}
        eventHandlers={{
          add: (e) => handleTileLoading(e.target),
        }}
      />
      {!loading && (
        <>
          <LegendControl variable={variable} url={wmsUrl} variableKey={variableKey} t={t} isMobile={isMobile} />
          {!isMobile && <CustomZoomControl />}
        </>
      )}
    </>
  );
};

export default LeafletMap;

// Leaflet legend control (form WMS GetLegendGraphic)
/**
 * LegendControl component to add a custom legend to a Leaflet map.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.variable - The variable object containing the id.
 * @param {string} props.url - The base URL for the legend graphic.
 * @param {string} props.variableKey - The key for the variable layer.
 * @param {function} props.t - Translation function for localization.
 * @param {boolean} props.isMobile - Flag indicating if the device is mobile.
 *
 * @returns {null} - This component does not render anything directly.
 *
 * @example
 * <LegendControl
 *   variable={{ id: 'koppen' }}
 *   url="http://example.com/legend"
 *   variableKey="koppen_layer"
 *   t={translateFunction}
 *   isMobile={false}
 * />
 */
const LegendControl = ({ variable, url, variableKey, t, isMobile }) => {
  const map = useMap();

  const variableId = variable.id;

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // Construct the GetLegendGraphic URL
      const legendUrl = `${url}?REQUEST=GetLegendGraphic&NUMCOLORBANDS=250&LAYER=${variableKey}&STYLES=default`;

      // Set the image as the legend
      div.innerHTML += `<img src="${legendUrl}" alt="legend" style="height: ${isMobile ? '200px' : '220px'}; padding: 5px 15px 5px 5px; background-color: white !important; border-radius: 5px;"/>`;

      const whiteSquare = L.DomUtil.create('div', 'white-square');
      whiteSquare.style.position = 'absolute';
      whiteSquare.style.top = '0';
      whiteSquare.style.right = '0';
      whiteSquare.style.height = `${isMobile ? '200px' : '220px'}`;
      whiteSquare.style.backgroundColor = 'white';
      whiteSquare.style.borderRadius = '5px';
      whiteSquare.style.display = 'flex';

      const verticalText = L.DomUtil.create('div', 'vertical-text');

      if (variableId === 'koppen' || variableId === 'trewartha') {

        const levels = variableId == 'koppen' ? ['Dsb', 'Dsa', 'Csb', 'Csa'] : ['Dc', 'Do', 'Cr', 'Cs'];

        whiteSquare.style.width = '58%'
        verticalText.style.display = 'flex';
        verticalText.style.flexDirection = 'column';

        levels.forEach((level) => {
          const levelDiv = L.DomUtil.create('div', 'level-div');
          levelDiv.style.height = '33.33%';
          levelDiv.style.display = 'flex';
          levelDiv.style.alignItems = 'center';
          levelDiv.style.justifyContent = 'flex-start';
          levelDiv.style.padding = '0px 4px';
          levelDiv.style.fontSize = '11px';
          levelDiv.style.color = 'black';

          const levelText = L.DomUtil.create('div', 'level-text');
          levelText.innerHTML = level;

          levelDiv.appendChild(levelText);
          verticalText.appendChild(levelDiv);
          whiteSquare.appendChild(verticalText);
        });

        const colorDiv = L.DomUtil.create('div', 'color-div');
        colorDiv.style.position = 'absolute';
        colorDiv.style.top = '0';
        colorDiv.style.left = '0';
        colorDiv.style.height = isMobile ? '190px' : '210px';
        colorDiv.style.display = 'flex';
        colorDiv.style.flexDirection = 'column';
        colorDiv.style.margin = '5px 15px 5px 5px';
        colorDiv.style.border = '1px solid black';

        if (variableId === 'koppen') {
          // create custom legend square colors for koppen, check variables.json file for colors)

          const colors = ['#87E878', '#8CC873', '#C5B53A', '#CADA35'];
          colors.forEach(color => {
            const colorSquare = L.DomUtil.create('div', 'color-square');
            colorSquare.style.width = '26px';
            colorSquare.style.height = '25%';
            colorSquare.style.backgroundColor = color;
            colorDiv.appendChild(colorSquare);
          });

          div.appendChild(colorDiv);

        } else {
          // create custom legend square colors for trewartha, check variables.json file for colors)
          const colors = ['#32C86A', '#78E664', '#A5F53C', '#F2DF1F'];
          colors.forEach(color => {
            const colorSquare = L.DomUtil.create('div', 'color-square');
            colorSquare.style.width = '26px';
            colorSquare.style.height = '25%';
            colorSquare.style.backgroundColor = color;
            colorDiv.appendChild(colorSquare);
          });

          div.appendChild(colorDiv);
        }
      } else if (variableId === 'UNEP') {

        div.style.width = '120px';

        const levels = [t('aridityClassificationLegend.hh'), t('aridityClassificationLegend.h'), t('aridityClassificationLegend.dsh'), t('aridityClassificationLegend.sa'), t('aridityClassificationLegend.a'), t('aridityClassificationLegend.ha')];

        whiteSquare.style.width = '74%';
        verticalText.style.display = 'flex';
        verticalText.style.flexDirection = 'column';

        levels.forEach((level) => {
          const levelDiv = L.DomUtil.create('div', 'level-div');
          levelDiv.style.height = '16.67%';
          levelDiv.style.display = 'flex';
          levelDiv.style.alignItems = 'center';
          levelDiv.style.justifyContent = 'flex-start';
          levelDiv.style.padding = '0px 4px';
          levelDiv.style.fontSize = '11px';
          levelDiv.style.color = 'black';

          const levelText = L.DomUtil.create('div', 'level-text');
          levelText.innerHTML = level;

          levelDiv.appendChild(levelText);
          verticalText.appendChild(levelDiv);
        });

        whiteSquare.appendChild(verticalText);

      } else {
        whiteSquare.style.width = '32%';
        verticalText.innerHTML = getLegendText(variableId, t);
        verticalText.style.position = 'absolute';
        verticalText.style.right = '2px';
        verticalText.style.transform = 'translateY(50%) rotate(-90deg)';
        verticalText.style.transformOrigin = 'right bottom';
        verticalText.style.padding = '2px 0px';
        verticalText.style.fontSize = '11px';
        verticalText.style.color = 'black';
        verticalText.style.whiteSpace = 'nowrap';
        verticalText.style.top = '-20px';

        whiteSquare.appendChild(verticalText);
      }

      div.appendChild(whiteSquare);

      return div;
    };

    legend.addTo(map);
    return () => {
      map.removeControl(legend);
    };
  }, [variableKey, url, map, variableId, isMobile, t]);

  return null;
};

// Custom zoom control
const CustomZoomControl = () => {
  const map = useMap();

  useEffect(() => {
    const zoomControl = L.control.zoom({
      position: 'topleft',
    });

    map.addControl(zoomControl);

    // Customize button styles via CSS
    const zoomIn = document.querySelector('.leaflet-control-zoom-in');
    const zoomOut = document.querySelector('.leaflet-control-zoom-out');

    zoomIn.innerHTML = '+';  // Customize icon/text
    zoomOut.innerHTML = '−';  // Customize icon/text

    // Apply custom styles
    zoomIn.style.cssText = `
      background-color: #fff !important;
      color: rgb(44, 44, 54) !important;
      background-color: #fff !important;
      box-shadow: 0px 0px 10px rgba(44, 44, 54, 0.1) !important;
      border: 1px solid #D9DFE4 !important;
      border-radius: 5px;
      font-size: 18px;
      margin: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    zoomOut.style.cssText = `
      background-color: #fff !important;
      color: rgb(44, 44, 54) !important;
      background-color: #fff !important;
      box-shadow: 0px 0px 10px rgba(44, 44, 54, 0.1) !important;
      border: 1px solid #D9DFE4 !important;
      border-radius: 5px;
      font-size: 18px;
      margin: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    return () => map.removeControl(zoomControl);
  }, [map]);

  return null;
};

const getLegendText = (variableId, t) => {

  switch (variableId) {
    case 'Tmean':
    case 'Tmax':
    case 'Tmin':
    case 'hw_int':
      return t('yAxisTitleTemp');

    case 'SPI12_dur':
      return t('yAxisTitleNMonths');
    
    case 'SPI12_int':
      return t('yAxisTitleSPI');
      
    case 'SPI12_n_events':
      return t('yAxisTitleNEvents');
      
    case 'hw_dur':
    case 'hw_ndays':
    case 'very_hot_days':
    case 'hot_days':
    case 'tropical_nights':
    case 'frost_days':
    case 'tdi':
    case 'tdi28':
    case 'utci26':
    case 'utci32':
    case 'fwi_above24':
    case 'PM25':
    case 'PM10':
    case 'O3':
    case 'NO2':
    case 'SO2':
    case 'CO':
      return t('yAxisTitleNDays');
    
    case 'hw_nwaves':
      return t('yAxisTitleNWaves');

    case 'wind_energy_100m':
      return t('yAxisTitleWind');

    case 'solar_energy':
      return t('yAxisTitleSolar');

    default:
      return '';
  }
}