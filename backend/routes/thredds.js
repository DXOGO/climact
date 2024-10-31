const express = require('express');
const XLSX = require('xlsx');
const path = require('path');

const router = express.Router();

// Mapping between variable domains and their respective file paths
const fileMapping = {
    TEMPS: path.join(__dirname, '../data/climatologias_TEMPS.xlsx'),
    NDAYS: path.join(__dirname, '../data/climatologias_NDAYS.xlsx'),
    WIND: path.join(__dirname, '../data/climatologias_WIND.xlsx'),
    SOLAR: path.join(__dirname, '../data/climatologias_SOLAR.xlsx'),
    FWI: path.join(__dirname, '../data/climatologias_FWI.xlsx'),
    WS100m: path.join(__dirname, '../data/climatologias_WS100m.xlsx') //! currently not in app
    // Add more mappings as new files are introduced
};

// Mapping of periods to column letters for each domain
const monthMapping = {
    hist: 'B',
    ssp245_2046_2065: 'C',
    ssp245_2081_2100: 'D',
    ssp370_2046_2065: 'E',
    ssp370_2081_2100: 'F',
    ssp585_2046_2065: 'G',
    ssp585_2081_2100: 'H'
};

const periodMapping = {
    TEMPS: {...monthMapping},
    NDAYS: {...monthMapping},
    WIND: {...monthMapping},
    SOLAR: {...monthMapping},
    FWI: {...monthMapping},
    WS100m: {...monthMapping} //! currently not in app
};

// Function to load data from an Excel file and return relevant sheet data
function getVariableData(domain, variable, period) {
    const filePath = fileMapping[domain];

    if (!filePath) {
        throw new Error(`No file found for domain: ${domain}`);
    }

    const workbook = XLSX.readFile(filePath); // Load the Excel file for the domain

    if (!workbook.Sheets[variable.trim()]) {
        throw new Error(`Sheet not found for variable: ${variable}`);
    }

    const sheet = workbook.Sheets[variable]; // Get the sheet based on the variable (e.g., Tmed, Tmax)
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to JSON

    // Get the corresponding column letter from the period mapping
    const periodColumn = periodMapping[domain][period];

    if (!periodColumn) {
        throw new Error(`Invalid period: ${period}`);
    }

    // Prepare data for the response
    const data = jsonData.slice(2).map((row) => {
        return {
            month: row[0], // Column A: Month names
            value: row[periodColumn.charCodeAt(0) - 65] // Convert column letter to index (A=0, B=1, etc.)
        };
    });

    return data;
}

// API to get data based on domain, variable, and period
router.get('/data/:domain/:variable/:period', (req, res) => {
    const { domain, variable, period } = req.params;

    try {
        const data = getVariableData(domain, variable, period);

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No data available for the specified parameters.'
            });
        }

        res.json(data);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error occurred:', error);

        // Send a 400 response with the error message
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;