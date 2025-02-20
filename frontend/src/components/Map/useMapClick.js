import { useState, useCallback } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useTranslation } from 'react-i18next';

const useMapClick = (wmsUrl, variable, variableKey) => {

    const { t } = useTranslation();

    const [clickedPosition, setClickedPosition] = useState(null);
    const [value, setValue] = useState(null);
    const map = useMap();

    const domain = variable.domain;
    let unitSymbol;

    if (domain === 'TEMPS' || variable.id === 'hw_int') {
        unitSymbol = '°C';
    } else if (domain === 'NDAYS' || domain === 'FWI' || domain === 'AQ' || domain === 'TD' || variable.id === 'hw_dur') {
        unitSymbol = t('daysPerYear');
    } else if (variable.id === 'SPI12_dur') {
        unitSymbol = t('monthsPerYear');
    } else if (domain === 'SOLAR' || domain === 'WIND') {
        unitSymbol = 'kW.h/m2';
    } else if (variable.id === 'SPI12_n_events') {
        unitSymbol = t('nEventsMap');
    } else {
        unitSymbol = '';
    }

    const koppenMapping = { 8: 'Csa', 9: 'Csb', 17: 'Dsa', 18: 'Dsb' }
    const trewarthaMapping = { 5: 'Cs', 7: 'Cr', 8: 'Do', 9: 'Dc' }
    const unepMapping = (value) => {
        if (value < 0.05) return t('aridityClassificationLegend.ha');
        if (value < 0.2) return t('aridityClassificationLegend.a');
        if (value < 0.5) return t('aridityClassificationLegend.sa');
        if (value < 0.65) return t('aridityClassificationLegend.dsh');
        if (value <= 0.75) return t('aridityClassificationLegend.h');
        return t('aridityClassificationLegend.hh');
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
            const valueLine = text.split('\n').find(line => line.includes('Value:'));
            if (valueLine) {
                const value = parseFloat(valueLine.split(':')[1].trim());
                return (domain === 'UNEP' || domain === 'SOLAR' || domain === 'WIND') ? value.toFixed(2) : value.toFixed(1);
            } else {
                return 'N/A';
            }
        } catch (error) {
            console.error('Error fetching feature info:', error);
            return 'Error';
        }
    }, [map, wmsUrl, variableKey, t]);

    const handleMapClick = useCallback(async (e) => {
        const { lat, lng } = e.latlng;
        const info = await getFeatureInfo(e.latlng);

        setClickedPosition(info !== 'N/A' ? { lat, lng } : null);
        
        if (domain === 'KOPPEN') {
            const classification = koppenMapping[parseInt(info)] || 'N/A';
            console.log("classification", classification)
            setValue(classification);
        } else if (domain === 'TREWARTHA') {
            const classification = trewarthaMapping[parseInt(info)] || 'N/A';
            setValue(classification);
        } else if (domain === 'UNEP') {
            const classification = unepMapping(parseFloat(info)) || 'N/A';
            setValue(classification);
        } else {
            setValue(info);
        }

    }, [getFeatureInfo]);

    const handleMapDblClick = (e) => {
        console.log("value", value)
        if (value === 'N/A') return;  // Prevent popup if value is 'N/A'

        const { lat, lng } = e.latlng;
        const label = (domain === 'KOPPEN' || domain === 'TREWARTHA' || domain === 'UNEP' ) ? t('classification') : t('average');
        const unit = (domain === 'KOPPEN' || domain === 'TREWARTHA'|| domain === 'UNEP') ? '' : unitSymbol;

        const popupContent = `
            <div style="background-color: #fff;">
                <p style="margin-bottom: 4px; color: rgb(39, 49, 57); font-size: 11px">
                    <strong>${label}:</strong> ${value} ${unit}
                </p>
                <p style="margin: 0; color: #373C41; font-size: 11px">Latitude: ${lat.toFixed(2)}</p>
                <p style="margin: 0; color: #373C41; font-size: 11px">Longitude: ${lng.toFixed(2)}</p>
            </div>
        `;
        L.popup().setLatLng([lat, lng]).setContent(popupContent).openOn(map);
    };

    useMapEvents({
        click: handleMapClick,
        dblclick: handleMapDblClick,
    });

    return { clickedPosition, value };
};

export default useMapClick;
