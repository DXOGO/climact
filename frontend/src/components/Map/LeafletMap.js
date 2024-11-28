import React, { useState, useEffect } from 'react';
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
  const variable = useSelector((state) => state.variable);
  const isMobile = useSelector((state) => state.isMobile);

  const variableKey = `${variable.id}_${timePeriod.id}`;

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
        minZoom={7}
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
        />
      </MapContainer>
    </div>
  );
};

const MapContent = ({ wmsUrl, variable, variableKey, selectedLayerInfo, handleTileLoading, loading }) => {
  useMapClick(wmsUrl, variable, variableKey);

  const isMobile = useSelector((state) => state.isMobile);

  return (
    <>
      <WMSTileLayer
        url={wmsUrl}
        layers={variableKey}
        styles={selectedLayerInfo[1]}
        format="image/png"
        transparent={true}
        version="1.3.0"
        colorScaleRange={selectedLayerInfo[2]}
        tileSize={512}
        numColorBands={250}
        eventHandlers={{
          add: (e) => handleTileLoading(e.target),
        }}
      />
      {!loading && (
        <>
          <LegendControl variable={variable} url={wmsUrl} variableKey={variableKey} />
          {!isMobile && <CustomZoomControl />}
        </>
      )}
    </>
  );
};

export default LeafletMap;

// Leaflet legend control (form WMS GetLegendGraphic)
const LegendControl = ({ variable, url, variableKey }) => {
  const map = useMap();

  const isMobile = useSelector((state) => state.isMobile);

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

      // Construct the GetLegendGraphic URL
      const legendUrl = `${url}?REQUEST=GetLegendGraphic&LAYER=${variableKey}&PALETTE=${palette}&STYLES=${styles}&COLORSCALERANGE=${colorScaleRange}`;

      // Set the image as the legend
      div.innerHTML += `<img src="${legendUrl}" alt="legend" style="height: ${isMobile ? '220px' : '240px'}; padding: 5px; background-color: white !important; border-radius: 5px;"/>`;
      return div;
    };

    legend.addTo(map);
    return () => {
      map.removeControl(legend);
    };
  }, [variableKey, url, map, variableId, isMobile]);

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
      font-size: 20px;
      margin: 5px;
    `;

    zoomOut.style.cssText = `
      background-color: #fff !important;
      color: rgb(44, 44, 54) !important;
      background-color: #fff !important;
      box-shadow: 0px 0px 10px rgba(44, 44, 54, 0.1) !important;
      border: 1px solid #D9DFE4 !important;
      border-radius: 5px;
      font-size: 20px;
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
      return ['default', 'default', '5,30'];

    case 'Tmax':
      return ['default', 'default', '10,30'];

    case 'Tmin':
      return ['default', 'default', '5,25'];

    case 'very_hot_days':
      return ['default', 'default', '0,30'];

    case 'hot_days':
      return ['default', 'default', '0,130'];

    case 'tropical_nights':
      return ['default', 'default', '0,100'];

    case 'frost_days':
      return ['default', 'default', '0,30'];

    // case 'WS100m':
    //   return ['default', 'default', '5,10'];

    case 'wind_energy_100m':
      return ['default', 'default', '0,5'];

    case 'solar_energy':
      return ['default', 'default', '1,2'];

    case 'high_days_fwi':
      return ['default', 'default', '10,50'];

    case 'very_high_days_fwi':
      return ['default', 'default', '30,70'];

    case 'extreme_days_fwi':
      return ['default', 'default', '10,50'];

    case 'very_extreme_days_fwi':
      return ['default', 'default', '10,50'];

    case 'exceptional_days_fwi':
      return ['default', 'default', '5,60'];

    case 'NO2':
      return ['default', 'default', '0,10'];

    case 'O3':
      return ['default', 'default', '0,30'];

    case 'PM10':
      return ['default', 'default', '0,20'];

    case 'PM25':
      return ['default', 'default', '0,20'];

    case 'CO':
      return ['default', 'default', '0,10'];

    case 'SO2':
      return ['default', 'default', '0,10'];

    default:
      return ['default', 'default-scalar/default', '-50,50'];
  }
};
