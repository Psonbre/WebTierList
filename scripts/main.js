import { initTierList, saveTierlist, loadTierlist } from './tierlist.js';
import { uploadTierlist, initTierlistFromUrl } from './githubAPI.js';

// Initialize the Tier List app
initTierList();
initTierlistFromUrl();

// Event listener for the "Save" button
var saveButton = document.querySelector('.saveBtn');
saveButton.addEventListener('click', saveTierlist);

// Event listener for the file input to load tierlist data
var loadInput = document.querySelector('.loadInput');
loadInput.addEventListener('change', loadTierlist);

const uploadTierlistBtn = document.querySelector('.uploadTierlistBtn');
uploadTierlistBtn.addEventListener('click', uploadTierlist);
