import React, { useState, useEffect } from 'react';
import { MapContainer, WMSTileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

import { useSelector } from 'react-redux';

const LeafletMap = () => {
  const [loading, setLoading] = useState(true); // State to track loading

  const timePeriod = useSelector((state) => state.timePeriod);
  const variable = useSelector((state) => state.variable);

  const variableKey = `${variable.id}_${timePeriod.id}`;

  // WMS URL in case there is 1 file per variable and time period
  // const wmsUrl = `http://localhost:80/thredds/wms/cesamAll/${variableKey}.nc`;

  // WMS URL for the selected dataset
  const wmsUrl = `http://localhost:80/thredds/wms/cesamAll/${timePeriod.id}.nc`;

  // Get selected variable layer information
  const selectedLayerInfo = getInfo(variable.id);

  // Function to handle tile loading events
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
        center={[39.6, -7.8]}
        zoom={7}
        minZoom={7}
        maxZoom={9}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        // scrollWheelZoom={false}
        key={variableKey}
      >

        {variable.id && (
          <WMSTileLayer
            key={variable.id}
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
        )}
        {/* Render the legend based on the selected variable */}
        {variable.id && <LegendControl url={wmsUrl} variableKey={variableKey} />}
        {/* Use custom zoom buttons */}
        {variable.id && <CustomZoomControl />}
      </MapContainer>
    </div>
  );
};


export default LeafletMap;

// Leaflet legend control (form WMS GetLegendGraphic)
const LegendControl = ({ url, variableKey }) => {
  const map = useMap();

  // get variable ID from variable key
  const variableId = variableKey.split('_')[0];

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
      div.innerHTML += `<img src="${legendUrl}" alt="legend" style="height: 220px; padding: 5px; background-color: white; border-radius: 5px;"/>`;
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
  switch (variable) {

    case 'Tmed':
      return ['default', 'default-scalar/default', '9,29'];

    case 'Tmax':
      return ['default', 'default-scalar/default', '11,29'];

    case 'Tmin':
      return ['default', 'default-scalar/default', '7,22'];

    default:
      return ['default', 'default-scalar/default', '5,30'];
  }
};
