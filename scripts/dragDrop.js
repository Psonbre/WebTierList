// dragDrop.js

var draggedRowElement = null;
var draggedElement = null;
let tierlistDiv = document.querySelector('.tierlist');

export function initDragDrop() {
    // Initialize event listeners related to drag and drop
    document.addEventListener('dragend', function() {
        draggedElement = null;  // Reset the dragged element
    });
}

export function handleRowDragStart(event) {
    draggedRowElement = event.target;
    event.dataTransfer.effectAllowed = 'move'; // Set allowed effect
    event.target.classList.add('dragging'); // Add a CSS class for visual feedback
}

export function handleRowDragOver(event) {
    event.preventDefault();
}

export function handleRowDragEnter(event) {
    event.target.classList.add('dragover'); // Add a CSS class for visual feedback 
}

export function handleRowDragLeave(event) {
    event.target.classList.remove('dragover'); // Remove the CSS class for visual feedback
}

export function allowRowDrop(event) {
    event.preventDefault();
}

export function handleRowDrop(event) {
    if (draggedRowElement == null) return;
    event.preventDefault();
    handleImageMouseOut();
    event.target.classList.remove('dragover'); // Remove the CSS class for visual feedback
    draggedRowElement.classList.remove('dragging')
    if (event.target === draggedRowElement || !draggedRowElement.classList.contains('row')) { return;}
    
    var target = event.target.closest('.row'); // Find the nearest itemsRow container

    if (event.y > target.getBoundingClientRect().y + target.getBoundingClientRect().height/2){
        tierlistDiv.insertBefore(draggedRowElement, target.nextSibling);
    } else {
        tierlistDiv.insertBefore(draggedRowElement, target);
    }
}

export function handleDragStart(event) {
    draggedElement = event.target;
    event.dataTransfer.setData('text/plain', ''); // Set data to empty string
    event.dataTransfer.setDragImage(event.target, 0, 0); // Set drag image
    event.dataTransfer.effectAllowed = 'move'; // Set allowed effect
    event.target.classList.add('dragging'); // Add a CSS class for visual feedback      
}

export function handleDragOver(event) {
    event.preventDefault();
}

export function handleDragEnter(event) {
    event.target.classList.add('dragover'); // Add a CSS class for visual feedback
}

export function handleDragLeave(event) {
    event.target.classList.remove('dragover'); // Remove the CSS class for visual feedback
}

export function allowDrop(event) {
    event.preventDefault();
}

export function handleDrop(event) {
    if (draggedElement == null) return;
    event.preventDefault();
    handleImageMouseOut();
    event.target.classList.remove('dragover'); // Remove the CSS class for visual feedback
    if (event.target === draggedElement || event.target.parentNode === draggedElement.parentNode.parentNode || event.target.classList.contains("tooltip") || !draggedElement.classList.contains('tierListImg')) {
        return; // Ignore if dropped on itself
    }

    var itemsRow = event.target.closest('.itemsRow'); // Find the nearest itemsRow container
    var images = Array.from(itemsRow.getElementsByClassName('tierListImg')); // Get all images within the itemsRow
  
    var dropIndex = images.indexOf(event.target); // Get the index of the drop target image
    var dragIndex = images.indexOf(draggedElement); // Get the index of the dragged image
  
    if (dropIndex < dragIndex) {
        itemsRow.insertBefore(draggedElement, event.target); // Insert the dragged element before the drop target
    } else {
        itemsRow.insertBefore(draggedElement, event.target.nextSibling); // Insert the dragged element after the drop target
    }
}

export function handleImageContextMenu(event) {
    event.preventDefault(); // Prevent the default context menu
    var image = event.target;
    var tooltip = document.querySelector('.tooltip')
    tooltip.parentNode.removeChild(tooltip);
    image.parentNode.removeChild(image); // Remove the image element from its parent
}

export function handleImageMouseOver(event) {
    var image = event.target;
    var imageName = image.itemName.split('.').slice(0, -1).join('.');
    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = imageName;

    tooltip.style.visibility = 'hidden'; // Hide the tooltip initially
    image.parentNode.appendChild(tooltip); // Append the tooltip to the image's parent container

    setTimeout(function() {
        tooltip.style.top = image.offsetTop - tooltip.offsetHeight - 10 + 'px'; // Position the tooltip above the image
        tooltip.style.left = image.offsetLeft + (image.offsetWidth - tooltip.offsetWidth) / 2 + 'px'; // Center the tooltip horizontally
        tooltip.style.visibility = 'visible'; // Show the tooltip
    }, 0);

    image.addEventListener('dblclick', makeTooltipModifiable.bind(tooltip));
}

function makeTooltipModifiable() {
    this.contentEditable = true;
    this.focus();
    const range = document.createRange();
    range.selectNodeContents(this);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    this.addEventListener('keydown', handleTooltipKeydown.bind(this));
    this.addEventListener('blur', saveTooltip.bind(this));
}

function handleTooltipKeydown(event) {
    if (event.keyCode === 13) { // Enter key
        event.preventDefault();
        saveTooltip.call(this);
    }
}

function saveTooltip() {
    var tooltip = this;
    var image = tooltip.previousSibling;
    image.itemName = tooltip.textContent.trim() + '.png';
    tooltip.contentEditable = false;
    tooltip.removeEventListener('keydown', handleTooltipKeydown);
    tooltip.removeEventListener('blur', saveTooltip);
    tooltip.style.top = image.offsetTop - tooltip.offsetHeight - 10 + 'px'; // Position the tooltip above the image
    tooltip.style.left = image.offsetLeft + (image.offsetWidth - tooltip.offsetWidth) / 2 + 'px'; // Center the tooltip horizontally
}

export function handleImageMouseOut(event) {
    var tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.parentNode.removeChild(tooltip);
    }
}