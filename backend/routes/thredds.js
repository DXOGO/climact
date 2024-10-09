const express = require('express');
const XLSX = require('xlsx');
const path = require('path');

const router = express.Router();

// Load Excel file
const filePath = path.join(__dirname, '../data/climatologias_TEMPS.xlsx');
const workbook = XLSX.readFile(filePath);

// Mapping of periods to column letters
const periodMapping = {
    hist: 'B',
    ssp245_2046_2065: 'C',
    ssp245_2081_2100: 'D',
    ssp370_2046_2065: 'E',
    ssp370_2081_2100: 'F',
    ssp585_2046_2065: 'G',
    ssp585_2081_2100: 'H'
};

// Function to get data from the sheet
function getVariableData(variable, period) {
    const sheet = workbook.Sheets[variable]; // Get the sheet based on the variable (Tmed, Tmax)
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert the sheet to JSON (array of arrays)

    // Get the corresponding column letter from the period mapping
    const periodColumn = periodMapping[period];

    if (!periodColumn) {
        throw new Error(`Invalid period: ${period}`);
    }

    // Prepare data for the response
    const data = jsonData.slice(2).map((row) => {
        return {
            month: row[0], // Column A: Month names
            temperature: row[periodColumn.charCodeAt(0) - 65] // Convert column letter to index (A=0, B=1, etc.)
        };
    });

    return data;
}

// API to get data based on variable and period
router.get('/data/:variable/:period', (req, res) => {
    const { variable, period } = req.params;

    try {
        const data = getVariableData(variable, period);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;