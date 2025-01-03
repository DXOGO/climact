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

  const selectedLayerInfo = getInfo(variable.id);

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
          selectedLayerInfo={selectedLayerInfo}
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

const MapContent = ({ wmsUrl, variable, variableKey, selectedLayerInfo, handleTileLoading, loading, t, isMobile }) => {

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
        colorScaleRange={selectedLayerInfo[2]}
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
const LegendControl = ({ variable, url, variableKey, t, isMobile }) => {
  const map = useMap();

  const variableId = variable.id;

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // Fetch legend information based on the layer
      const legendInfo = getInfo(variableId);
      const palette = legendInfo[0];
      const styles = legendInfo[1];
      const colorScaleRange = legendInfo[2];
      const numColorBands = 250;

      // Construct the GetLegendGraphic URL
      const legendUrl = `${url}?REQUEST=GetLegendGraphic&NUMCOLORBANDS=${numColorBands}&LAYER=${variableKey}&PALETTE=${palette}&STYLES=${styles}&COLORSCALERANGE=${colorScaleRange}`;

      // Set the image as the legend
      div.innerHTML += `<img src="${legendUrl}" alt="legend" style="height: ${isMobile ? '200px' : '220px'}; padding: 5px 15px 5px 5px; background-color: white !important; border-radius: 5px;"/>`;

      // Add a white square on top of the legend to cover the text in all variables except koppen and trewartha
      const whiteSquare = L.DomUtil.create('div', 'white-square');
      whiteSquare.style.position = 'absolute';
      whiteSquare.style.top = '0';
      whiteSquare.style.right = '0';
      whiteSquare.style.height = `${isMobile ? '200px' : '220px'}`;
      whiteSquare.style.backgroundColor = 'white';
      whiteSquare.style.display = 'flex';

      const verticalText = L.DomUtil.create('div', 'vertical-text');

      if (variableId === 'koppen' || variableId === 'trewartha') {

        whiteSquare.style.width = '58%'

        const levels = variableId == 'koppen' ? ['Dsb', 'Dsa', 'Csb', 'Csa'] : ['Dc', 'Do', 'Cr', 'Cs'];

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
          // create custom legend square colors, check variables.json file for colors)

          const colorSquare = L.DomUtil.create('div', 'color-square');
          colorSquare.style.width = '26px';
          colorSquare.style.height = '25%';
          colorSquare.style.backgroundColor = '#87E878';
          colorDiv.appendChild(colorSquare);

          const colorSquare2 = L.DomUtil.create('div', 'color-square');
          colorSquare2.style.width = '26px';
          colorSquare2.style.height = '25%';
          colorSquare2.style.backgroundColor = '#8CC873';
          colorDiv.appendChild(colorSquare2);

          const colorSquare3 = L.DomUtil.create('div', 'color-square');
          colorSquare3.style.width = '26px';
          colorSquare3.style.height = '25%';
          colorSquare3.style.backgroundColor = '#C5B53A';
          colorDiv.appendChild(colorSquare3);

          const colorSquare4 = L.DomUtil.create('div', 'color-square');
          colorSquare4.style.width = '26px';
          colorSquare4.style.height = '25%';
          colorSquare4.style.backgroundColor = '#CADA35';
          colorDiv.appendChild(colorSquare4);

          div.appendChild(colorDiv);

        } else {
          // create custom legend square colors, check variables.json file for colors)
          const colorSquare = L.DomUtil.create('div', 'color-square');
          colorSquare.style.width = '26px';
          colorSquare.style.height = '25%';
          colorSquare.style.backgroundColor = '#32C86A';
          colorDiv.appendChild(colorSquare);

          const colorSquare3 = L.DomUtil.create('div', 'color-square');
          colorSquare3.style.width = '26px';
          colorSquare3.style.height = '25%';
          colorSquare3.style.backgroundColor = '#78E664';
          colorDiv.appendChild(colorSquare3);

          const colorSquare4 = L.DomUtil.create('div', 'color-square');
          colorSquare4.style.width = '26px';
          colorSquare4.style.height = '25%';
          colorSquare4.style.backgroundColor = '#A5F53C';
          colorDiv.appendChild(colorSquare4);

          const colorSquare5 = L.DomUtil.create('div', 'color-square');
          colorSquare5.style.width = '26px';
          colorSquare5.style.height = '25%';
          colorSquare5.style.backgroundColor = '#F2DF1F';
          colorDiv.appendChild(colorSquare5);

          div.appendChild(colorDiv);
        }
      } else {
        whiteSquare.style.width = '30%';
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
    `;

    return () => map.removeControl(zoomControl);
  }, [map]);

  return null;
};

const getInfo = (variable) => {
  // Pallete, style, colorScaleRange 
  // ! ALL DEFAULT BECAUSE PALLETES AND STYLES ARE BEING SET ON WMSCONFIG.XML AND THREDDSCONFIG.XML FILES
  switch (variable) {
    case 'Tmean':
      return ['seq-Heat-inv', 'default', '5,30'];

    case 'Tmax':
      return ['seq-Heat-inv', 'default', '10,30'];

    case 'Tmin':
      return ['seq-Heat-inv', 'default', '5,25'];

    case 'very_hot_days':
      return ['seq-Heat-inv', 'default', '0,30'];

    case 'hot_days':
      return ['seq-Heat-inv', 'default', '0,130'];

    case 'tropical_nights':
      return ['seq-Heat-inv', 'default', '0,100'];

    case 'frost_days':
      return ['psu-viridis', 'default', '0,30'];

    // case 'WS100m':
    //   return ['default', 'default', '5,10'];

    case 'wind_energy_100m':
      return ['seq-cubeYF-inv', 'default', '0,5'];

    case 'solar_energy':
      return ['seq-cubeYF-inv', 'default', '1.5,2'];

    case 'high_days_fwi':
      return ['seq-Heat-inv', 'default', '10,50'];

    case 'very_high_days_fwi':
      return ['seq-Heat-inv', 'default', '30,70'];

    case 'extreme_days_fwi':
      return ['seq-Heat-inv', 'default', '10,50'];

    case 'very_extreme_days_fwi':
      return ['seq-Heat-inv', 'default', '10,50'];

    case 'exceptional_days_fwi':
      return ['seq-Heat-inv', 'default', '5,60'];

    case 'NO2':
      return ['seq-BlueHeat-inv', 'default', '0,10'];

    case 'O3':
      return ['seq-BlueHeat-inv', 'default', '0,30'];

    case 'PM10':
      return ['seq-BlueHeat-inv', 'default', '0,20'];

    case 'PM25':
      return ['seq-BlueHeat-inv', 'default', '0,20'];

    case 'CO':
      return ['seq-BlueHeat-inv', 'default', '0,10'];

    case 'SO2':
      return ['seq-BlueHeat-inv', 'default', '0,10'];

    case 'tdi':
      return ['seq-Heat-inv', 'default', '0,80'];

    case 'utci26':
      return ['seq-Heat-inv', 'default', '0,50'];

    case 'utci32':
      return ['seq-Heat-inv', 'default', '0,10'];

    case 'koppen':
      return ['x-Ncview-inv', 'default', '0,38'];

    case 'trewartha':
      return ['x-Occam-inv', 'default', '-5,25'];

    default:
      return ['default', 'default-scalar/default', '-50,50'];
  }
};


const getLegendText = (variableId, t) => {

  switch (variableId) {
    case 'Tmean':
    case 'Tmax':
    case 'Tmin':
      return t('yAxisTitleTemp');

    case 'very_hot_days':
    case 'hot_days':
    case 'tropical_nights':
    case 'frost_days':
    case 'tdi':
    case 'utci26':
    case 'utci32':
    case 'high_days_fwi':
    case 'very_high_days_fwi':
    case 'extreme_days_fwi':
    case 'very_extreme_days_fwi':
    case 'exceptional_days_fwi':
      return t('yAxisTitleNDays');

    case 'wind_energy_100m':
      return t('yAxisTitleWind');

    case 'solar_energy':
      return t('yAxisTitleSolar');

    default:
      return '';
  }
}