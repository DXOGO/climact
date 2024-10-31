import { useState, useCallback } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const useMapClick = (wmsUrl, variable, variableKey) => {

    const [clickedPosition, setClickedPosition] = useState(null);
    const [value, setValue] = useState(null);
    const map = useMap();

    const domain = variable.domain;
    let unitSymbol;

    if (domain === 'TEMPS') {
        unitSymbol = '°C';
    } else if (domain === 'NDAYS' || domain === 'FWI') {
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
        <p style="margin: 0; color: #373C41; font-size: 10px">Latitude: ${lat.toFixed(2)}</p>
        <p style="margin: 0; color: #373C41; font-size: 10px">Longitude: ${lng.toFixed(2)}</p>
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

export default useMapClick;