import React, { useEffect } from 'react';
import { MapContainer, WMSTileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

import { useSelector } from 'react-redux'; // Import Redux

const LeafletMap = () => {
  // Use Redux selectors for timePeriod and variable
  const timePeriod = useSelector((state) => state.timePeriod);
  const variable = useSelector((state) => state.variable);

  // let scenario;
  // if (timePeriod.id.includes('ssp')) { scenario = 'ssp'; } else { scenario = 'historical';}

  const variableKey = `${variable.id}-${timePeriod.id}`;

  // WMS URL for the selected dataset
  const wmsUrl = `http://localhost:80/thredds/wms/cesamAll/TMAX_TMEAN_TMIN/${timePeriod.id}.nc`;

  // Get selected variable layer information
  const selectedLayerInfo = getInfo(variable.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <MapContainer
        center={[39.5, -8]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        key={variableKey}
        zoomControl={false}
      >

        {variable.id && (
          <WMSTileLayer
            INTERPOLATION="bilinear"
            key={variable.id}
            url={wmsUrl}
            layers={variable.id}
            styles={selectedLayerInfo[1]} // Get styles based on the selected variable
            format="image/png"
            transparent={true}
            version="1.1.1"
            colorScaleRange={selectedLayerInfo[2]} // Set the color scale range for the selected layer
          />
        )}
        {/* Render the legend based on the selected variable */}
        {variable.id && <LegendControl variable={variable.id} url={wmsUrl} />}
        {/* Use custom zoom buttons */}
        {variable.id && <CustomZoomControl />}
      </MapContainer>
    </div>
  );
};


export default LeafletMap;

// Leaflet legend control (form WMS GetLegendGraphic)
const LegendControl = ({ variable, url }) => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // Fetch legend information based on the layer
      const legendInfo = getInfo(variable);
      const palette = legendInfo[0];
      const styles = legendInfo[1];
      const colorScaleRange = legendInfo[2];

      // change color scale range to Celsius
      const [min, max] = colorScaleRange.split(',');
      const minCelsius = convertKelvinToCelsius(min).toFixed(2);
      const maxCelsius = convertKelvinToCelsius(max).toFixed(2);
      const colorScaleRangeCelsius = `${minCelsius},${maxCelsius}`;

      // Construct the GetLegendGraphic URL
      const legendUrl = `${url}?REQUEST=GetLegendGraphic&LAYER=${variable}&PALETTE=${palette}&STYLES=${styles}&COLORSCALERANGE=${colorScaleRangeCelsius}`;

      // Set the image as the legend
      div.innerHTML += `<img src="${legendUrl}" alt="legend" style="height: 220px;">`;
      return div;
    };

    legend.addTo(map);
    return () => {
      map.removeControl(legend);
    };
  }, [variable, url, map]);

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

function convertKelvinToCelsius(kelvinValue) { return kelvinValue - 273.15; }


const getInfo = (variable) => {
  // Celsius to Kelvin conversion: K = °C + 273.15
  switch (variable) {
    /* --------------------------- T2MEAN ---------------------------  */

    case 'T2MEAN':
      return ['default', 'default-scalar/default', '282.15,302.15'];

    // case 'T2MEAN-wrfout_historical_TEMPS':
    //   return ['default', 'default-scalar/default', '282.15,296.15'];

    // case 'T2MEAN-wrfout_ssp245_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '285.15,301.15'];
    // case 'T2MEAN-wrfout_ssp245_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '286.15,300.15'];

    // case 'T2MEAN-wrfout_ssp370_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '285.15,301.15'];
    // case 'T2MEAN-wrfout_ssp370_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '286.15,302.15'];

    // case 'T2MEAN-wrfout_ssp585_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '285.15,301.15'];
    // case 'T2MEAN-wrfout_ssp585_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '287.15,302.15'];

    /* --------------------------- T2MAX ---------------------------  */

    case 'T2MAX':
      return ['default', 'default-scalar/default', '284.15,302.15'];

    // case 'T2MAX-wrfout_historical_TEMPS':
    //   return ['default', 'default-scalar/default', '284.15,298.15'];

    // case 'T2MAX-wrfout_ssp245_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '285.15,301.15'];
    // case 'T2MAX-wrfout_ssp245_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '285.15,300.15'];

    // case 'T2MAX-wrfout_ssp370_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '285.15,301.15'];
    // case 'T2MAX-wrfout_ssp370_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '286.15,302.15'];

    // case 'T2MAX-wrfout_ssp585_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '285.15,301.15'];
    // case 'T2MAX-wrfout_ssp585_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '287.15,302.15'];

    /* --------------------------- T2MIN ---------------------------  */

    case 'T2MIN':
      return ['default', 'default-scalar/default', '280.15,295.15'];

    // case 'T2MIN-wrfout_historical_TEMPS':
    //   return ['default', 'default-scalar/default', '280.15,292.15'];

    // case 'T2MIN-wrfout_ssp245_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '281.15,293.15'];
    // case 'T2MIN-wrfout_ssp245_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '282.15,293.15'];

    // case 'T2MIN-wrfout_ssp370_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '281.15,294.15'];
    // case 'T2MIN-wrfout_ssp370_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '282.15,294.15'];

    // case 'T2MIN-wrfout_ssp585_2046_2065_TEMPS':
    //   return ['default', 'default-scalar/default', '281.15,294.15'];
    // case 'T2MIN-wrfout_ssp585_2081_2100_TEMPS':
    //   return ['default', 'default-scalar/default', '283.15,295.15'];

    /* --------------------------- DEFAULT ---------------------------  */

    default:
      return ['default', 'default-scalar/default', '278.15,303.15'];
  }
};
