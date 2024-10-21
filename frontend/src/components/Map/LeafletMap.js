import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, WMSTileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

const useMapClick = (wmsUrl, variable, variableKey) => {
  
  const [clickedPosition, setClickedPosition] = useState(null);
  const [value, setValue] = useState(null);
  const map = useMap();

  const domain = variable.domain;
  let unitSymbol;

  if (domain === 'TEMPS') {
    unitSymbol = '°C';
  } else if (domain === 'NDAYS') {
    unitSymbol = 'days per year';
  } else if (domain === 'WS') {
    unitSymbol = 'm/s';
  }

  const getFeatureInfo = useCallback(async (latlng) => {
    const size = map.getSize();
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const params = new URLSearchParams({
      REQUEST: 'GetFeatureInfo',
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      LAYERS: variableKey,
      QUERY_LAYERS: variableKey,
      INFO_FORMAT: 'text/plain',
      I: Math.round((latlng.lng - sw.lng) / (ne.lng - sw.lng) * size.x),
      J: Math.round((ne.lat - latlng.lat) / (ne.lat - sw.lat) * size.y),
      CRS: 'EPSG:4326',
      WIDTH: size.x,
      HEIGHT: size.y,
      BBOX: `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`
    });

    try {
      const response = await fetch(`${wmsUrl}?${params}`);
      const text = await response.text();

      // Parse the plain text response
      const lines = text.split('\n');
      const valueLine = lines.find(line => line.includes('Value:'));
      if (valueLine) {
        const value = valueLine.split(':')[1].trim();
        return isNaN(value) ? value : parseFloat(value).toFixed(1);
      }
      return 'N/A';
    } catch (error) {
      console.error('Error fetching feature info:', error);
      return 'Error';
    }
  }, [map, wmsUrl, variableKey]);

  const handleMapClick = useCallback(async (e) => {
    const { lat, lng } = e.latlng;
    setClickedPosition({ lat, lng });
    const info = await getFeatureInfo(e.latlng);
    setValue(info);
  }, [getFeatureInfo]);

  const handleMapDblClick = (e) => {
    const { lat, lng } = e.latlng;
    setClickedPosition({ lat, lng });

    const popupContent = `
    <div style="background-color: #fff">
      <p style="margin-bottom: 4px; color: #25292C; font-size: 12px"><strong>Average:</strong> ${value} ${unitSymbol}</p>
      <p style="margin: 0; color: #373C41; font-size: 12px">Latitude: ${lat.toFixed(2)}</p>
      <p style="margin: 0; color: #373C41; font-size: 12px">Longitude: ${lng.toFixed(2)}</p>
    </div>
  `;
    L.popup()
      .setLatLng([lat, lng])
      .setContent(popupContent)
      .openOn(map);
  };

  useMapEvents({
    click: handleMapClick,
    dblclick: handleMapDblClick,
  });

  return { clickedPosition, value };
};

const LeafletMap = () => {
  const [loading, setLoading] = useState(true);

  const timePeriod = useSelector((state) => state.timePeriod);
  const variable = useSelector((state) => state.variable);
  const isMobile = useSelector((state) => state.isMobile);

  const variableKey = `${variable.id}_${timePeriod.id}`;
  const wmsUrl = `http://localhost:80/thredds/wms/cesamAll/${variable.domain}/${variableKey}.nc`;

  const selectedLayerInfo = getInfo(variable.id);

  const handleTileLoading = (layer) => {
    layer.on('load', () => {
      setLoading(false);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {loading && (
        <div className="loading-container">
          <div className="loading-icon" />
        </div>
      )}
      <MapContainer
        center={ isMobile ? [39.8, -7.8] : [39.6, -7.8] }
        zoom={7}
        minZoom={7}
        maxZoom={9}
        zoomControl={false}
        style={{ height: !isMobile ? '100%' : '600px' , width: '100%' }}
        key={variableKey}
        doubleClickZoom={false}
      >
        <MapContent wmsUrl={wmsUrl} variable={variable} variableKey={variableKey} selectedLayerInfo={selectedLayerInfo} handleTileLoading={handleTileLoading} />
      </MapContainer>
    </div>
  );
};

const MapContent = ({ wmsUrl, variable, variableKey, selectedLayerInfo, handleTileLoading }) => {
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
        numColorBands={250}
        eventHandlers={{
          add: (e) => handleTileLoading(e.target),
        }}
      />
      <LegendControl variable={variable} url={wmsUrl} variableKey={variableKey} />
      {!isMobile && <CustomZoomControl />}
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
      div.innerHTML += `<img src="${legendUrl}" alt="legend" style="height: ${isMobile ? '200px' : '220px'}; padding: 5px; background-color: white; border-radius: 5px;"/>`;
      return div;
    };

    legend.addTo(map);
    return () => {
      map.removeControl(legend);
    };
  }, [variableKey, url, map]);

  return null;
};

// Custom zoom control
const CustomZoomControl = () => {
  const map = useMap();

  useEffect(() => {
    const zoomControl = L.control.zoom({
      position: 'topleft', // or customize placement
    });

    map.addControl(zoomControl);

    // Customize button styles via CSS
    const zoomIn = document.querySelector('.leaflet-control-zoom-in');
    const zoomOut = document.querySelector('.leaflet-control-zoom-out');

    zoomIn.innerHTML = '+';  // Customize icon/text
    zoomOut.innerHTML = '−';  // Customize icon/text

    // Apply custom styles
    zoomIn.style.cssText = `
      background-color: #fff;
      color: #25292C;
      border-radius: 5px;
      font-size: 20px;
      margin: 5px;
    `;

    zoomOut.style.cssText = `
      background-color: #fff;
      color: #25292C;
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

    case 'WS100m':
      return ['default', 'default', '5,10'];

    default:
      return ['default', 'default-scalar/default', '-50,50'];
  }
};
