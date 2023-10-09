// tierlist.js
import { allowRowDrop, handleRowDrop, handleRowDragStart, handleRowDragOver, handleRowDragEnter, handleRowDragLeave, allowDrop, handleDrop, handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleImageContextMenu, handleImageMouseOver, initDragDrop, handleImageMouseOut } from './dragDrop.js';

var colors = ['#ff5252', '#ff9f43', '#ffc107', '#4caf50', '#03a9f4', '#673ab7'];
let tierlistDiv = null;
let rowCount = 0;

export function initTierList() {
    tierlistDiv = document.querySelector('.tierlist');

    // Create the initial rows
    for (var i = 0; i < 6; i++) {
        createRow();
    }

    var addRowButton = document.querySelector('.addRowBtn');
    addRowButton.addEventListener('click', createRow);

    var removeRowButton = document.querySelector('.removeRowBtn');
    removeRowButton.addEventListener('click', function() {
        var rows = tierlistDiv.getElementsByClassName('row');
        if (rows.length > 0) {
            var lastRow = rows[rows.length - 1];
            lastRow.parentNode.removeChild(lastRow);
            rowCount--;
        }
    });

    var trashElement = document.querySelector('.trash');
    trashElement.addEventListener('click', handleTrashClick);

    var addButton = document.querySelector('.imgBtn');
    addButton.addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.multiple = true;
        fileInput.addEventListener('change', function(event) {
            handleFiles(event.target.files);
        });
        fileInput.click();
    });

    // Initialize drag and drop functionality
    initDragDrop();
}

function createRow(){
    var alphabet = 'SABCDEFGHIJKLMNOPQRTUVWXYZ';
    var letter = alphabet[rowCount];
    var div = document.createElement('div');
    div.addEventListener('dragover', allowRowDrop);
    div.addEventListener('drop', handleRowDrop);
    div.addEventListener('dragstart', handleRowDragStart);
    div.addEventListener('dragover', handleRowDragOver);
    div.addEventListener('dragenter', handleRowDragEnter);
    div.addEventListener('dragleave', handleRowDragLeave);
    div.draggable = true;
    div.className = 'row';
    var ratingDiv = document.createElement('div');
    ratingDiv.className = 'ratingDiv';
    ratingDiv.style.backgroundColor = colors[rowCount % colors.length]; // Cycle through the colors for each rating
    var rating = document.createElement('input');
    rating.className = 'rating';
    rating.value = letter;
    rating.maxLength = 1
    var itemsDiv = document.createElement('div');
    itemsDiv.className = 'itemsRow itemsRow' + rowCount.toString();
    itemsDiv.addEventListener('dragover', allowDrop);
    itemsDiv.addEventListener('drop', handleDrop);
    itemsDiv.addEventListener('dragstart', handleDragStart);
    itemsDiv.addEventListener('dragover', handleDragOver);
    itemsDiv.addEventListener('dragenter', handleDragEnter);
    itemsDiv.addEventListener('dragleave', handleDragLeave);
    ratingDiv.appendChild(rating);
    div.appendChild(ratingDiv);
    div.appendChild(itemsDiv);
    tierlistDiv.appendChild(div);
    rowCount++;
}

function handleFiles(files) {
    var reader;

    for (var i = 0; i < files.length; i++) {
      reader = new FileReader();


      reader.onload = (function(file) {
        var img = document.createElement('img');
        img.src = "../assets/images/loading.gif"
        document.getElementsByClassName('itemsRow0')[0].appendChild(img);

        img.className = 'tierListImg';
        return function(e) {
          img.itemName = file.name; 
          img.addEventListener('contextmenu', handleImageContextMenu);
          img.addEventListener('mouseover', handleImageMouseOver);
          img.addEventListener('mouseout', handleImageMouseOut);
          img.addEventListener('dragstart', handleDragStart);
          
          img.onload = function() {
            img.onload = function(){}
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var aspectRatio = img.width / img.height;
            var newHeight = 115;
            var newWidth = newHeight * aspectRatio;
  
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
            img.src = canvas.toDataURL(); // Resized image
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
          };
          img.src = e.target.result;
          
        };
      })(files[i]);

      reader.readAsDataURL(files[i]);
    }
}

function handleTrashClick() {
    var images = document.querySelectorAll('.tierListImg');
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        image.parentNode.removeChild(image);
    }
    document.querySelector(".title").value = 'Tier List';
}

export function saveTierlist() {
    var tierlistData = [];
    var rows = document.getElementsByClassName('row');
    var title = document.querySelector('.title').value; // Get the title of the tier list
  
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var rating = row.querySelector('.rating').value;
      var images = Array.from(row.getElementsByClassName('tierListImg')).map(function (img) {
        return {
          src: img.src,
          itemName: img.itemName // Save the itemName property along with the image source
        };
      });
  
      tierlistData.push({
        rating: rating,
        images: images
      });
    }
  
    var jsonData = JSON.stringify({ title: title, tiers: tierlistData }, null, 2); // Include the title in the JSON
    var filename = 'tierlist.json';
    var blob = new Blob([jsonData], { type: 'application/json' });
  
    // Create a temporary <a> element to initiate the download
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  
    // Clean up the temporary <a> element
    URL.revokeObjectURL(link.href);
}

export function loadTierlist(event) {
    var file = event.target.files[0];
  
    
    var reader = new FileReader();
    reader.onload = function (e) {
      var jsonData = e.target.result;
      var tierlistData = JSON.parse(jsonData);
  
      // Clear existing tierlist
      var tierlistDiv = document.querySelector('.tierlist');
      tierlistDiv.innerHTML = '';
  
      // Reconstruct the tierlist from the loaded data
      var title = tierlistData.title; // Get the title from the loaded data
      document.querySelector('.title').value = title; // Set the title of the tier list
  
      var tiers = tierlistData.tiers; // Get the tiers data
      for (var i = 0; i < tiers.length; i++) {
        var row = tiers[i];
        var rating = row.rating;
        var images = row.images;
  
        var div = document.createElement('div');
        div.className = 'row';
        div.addEventListener('dragover', allowRowDrop);
        div.addEventListener('drop', handleRowDrop);
        div.addEventListener('dragstart', handleRowDragStart);
        div.addEventListener('dragover', handleRowDragOver);
        div.addEventListener('dragenter', handleRowDragEnter);
        div.addEventListener('dragleave', handleRowDragLeave);
        div.draggable = true;
        // Add event listeners for row dragging
  
        var ratingDiv = document.createElement('div');
        ratingDiv.className = 'ratingDiv';
        ratingDiv.style.backgroundColor = colors[i];
        var ratingInput = document.createElement('input');
        ratingInput.className = 'rating';
        ratingInput.value = rating;
  
        var itemsDiv = document.createElement('div');
        itemsDiv.className = 'itemsRow itemsRow' + i.toString();
        itemsDiv.addEventListener('dragover', allowDrop);
        itemsDiv.addEventListener('drop', handleDrop);
  
        function handleImageLoad(image) {
          return function() {
            if (!image.resized) {
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              var aspectRatio = image.width / image.height;
              var newHeight = 115;
              var newWidth = newHeight * aspectRatio;
        
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(image, 0, 0, newWidth, newHeight);
              image.src = canvas.toDataURL(); // Resized image
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              image.resized = true; // Set the resized flag
            }
          };
        }
        
        for (var j = 0; j < images.length; j++) {
          var img = document.createElement('img');
        
          img.className = 'tierListImg';
          img.addEventListener('contextmenu', handleImageContextMenu);
          img.addEventListener('mouseover', handleImageMouseOver);
          img.addEventListener('mouseout', handleImageMouseOut);
          img.addEventListener('dragstart', handleDragStart);
          img.className = 'tierListImg';
          img.itemName = images[j].itemName; // Assign the itemName property to the image element
          itemsDiv.appendChild(img);
        
          img.onload = handleImageLoad(img);
          img.src = images[j].src;
        }
        ratingDiv.appendChild(ratingInput);
        div.appendChild(ratingDiv);
        div.appendChild(itemsDiv);
        tierlistDiv.appendChild(div);
      }
    };
  
    reader.readAsText(file);
} 
