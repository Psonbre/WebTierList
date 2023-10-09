import { initGoogleSheetsAPI } from './googleSheetsAPI.js';
import { initTierList, saveTierlist, loadTierlist } from './tierlist.js';

// Initialize the Google Sheets API
initGoogleSheetsAPI();

// Initialize the Tier List app
initTierList();

// Event listener for the "Save" button
var saveButton = document.querySelector('.saveBtn');
saveButton.addEventListener('click', saveTierlist);

// Event listener for the file input to load tierlist data
var loadInput = document.querySelector('.loadInput');
loadInput.addEventListener('change', loadTierlist);
