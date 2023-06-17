var colors = ['#ff5252', '#ff9f43', '#ffc107', '#4caf50', '#03a9f4', '#673ab7'];
window.addEventListener('DOMContentLoaded', function() {
    var tierlistDiv = document.querySelector('.tierlist');
    var alphabet = 'SABCDEFGHIJKLMNOPQRTUVWXYZ';
    // Classic tier list colors

    for (var i = 0; i < 6; i++) {
      var letter = alphabet[i];
      var div = document.createElement('div');
      div.className = 'row';
      var ratingDiv = document.createElement('div');
      ratingDiv.className = 'ratingDiv';
      ratingDiv.style.backgroundColor = colors[i % colors.length]; // Cycle through the colors for each rating
      var rating = document.createElement('input');
      rating.className = 'rating';
      rating.value = letter;
      rating.maxLength = 1
      var itemsDiv = document.createElement('div');
      itemsDiv.className = 'itemsRow itemsRow' + i.toString();
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
    }

    var addRowButton = document.querySelector('.addRowBtn');
    addRowButton.addEventListener('click', function() {
      var tierlistDiv = document.querySelector('.tierlist');
      var alphabet = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var numRows = tierlistDiv.getElementsByClassName('row').length;
  
      if (numRows >= alphabet.length) {
        return; // Maximum number of rows reached
      }
  
      var letter = alphabet[numRows];
      var div = document.createElement('div');
      div.className = 'row';
      var ratingDiv = document.createElement('div');
      ratingDiv.style.backgroundColor = colors[numRows % colors.length];
      ratingDiv.className = 'ratingDiv';
      var rating = document.createElement('input');
      rating.className = 'rating';
      rating.maxLength = 1;
      rating.value = letter;
      var itemsDiv = document.createElement('div');
      itemsDiv.className = 'itemsRow itemsRow' + numRows.toString();
      itemsDiv.addEventListener('dragover', allowDrop);
      itemsDiv.addEventListener('drop', handleDrop);
      ratingDiv.appendChild(rating);
      div.appendChild(ratingDiv);
      div.appendChild(itemsDiv);
      tierlistDiv.appendChild(div);
    });

    var removeRowButton = document.querySelector('.removeRowBtn');
    removeRowButton.addEventListener('click', function() {
      var tierlistDiv = document.querySelector('.tierlist');
      var rows = tierlistDiv.getElementsByClassName('row');
  
      if (rows.length > 0) {
        var lastRow = rows[rows.length - 1];
        lastRow.parentNode.removeChild(lastRow);
      }
    });

    var trashElement = document.querySelector('.trash');
    trashElement.addEventListener('click', handleTrashClick);
  });
  
  
  window.addEventListener('DOMContentLoaded', function() {
    var addButton = document.querySelector('.imgBtn');
    var tierlistDiv = document.querySelector('.tierlist');
  
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
  
    // Function to handle pasted images
    function handlePaste(event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;
      var files = [];
  
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && items[i].type.includes('image')) {
          var file = items[i].getAsFile();
          files.push(file);
        }
      }
  
      handleFiles(files);
    }
  
    // Function to handle selected files
    function handleFiles(files) {
      var reader;
  
      for (var i = 0; i < files.length; i++) {
        reader = new FileReader();


        reader.onload = (function(file) {
          var img = document.createElement('img');
          img.src = "loading.gif"
          document.getElementsByClassName('itemsRow0')[0].appendChild(img);
  
          img.className = 'tierListImg';
          return function(e) {
            img.itemName = file.name; 
            img.addEventListener('contextmenu', handleImageContextMenu);
            img.addEventListener('mouseover', handleImageMouseOver);
            img.addEventListener('mouseout', handleImageMouseOut);
            img.addEventListener('dragstart', handleDragStart);
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            
            img.onload = function() {
              var aspectRatio = img.width / img.height;
              var newHeight = 115;
              var newWidth = newHeight * aspectRatio;
    
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
              img.src = canvas.toDataURL(); // Resized image
              
            };
            img.src = e.target.result;
            
          };
        })(files[i]);
  
        reader.readAsDataURL(files[i]);
      }
    }
  
    // Add event listener for paste event
    window.addEventListener('paste', handlePaste);
  });
  
  
  var draggedElement = null;
  
  function handleDragStart(event) {
    draggedElement = event.target;
    event.dataTransfer.setData('text/plain', ''); // Set data to empty string
    event.dataTransfer.setDragImage(event.target, 0, 0); // Set drag image
    event.dataTransfer.effectAllowed = 'move'; // Set allowed effect
    event.target.classList.add('dragging'); // Add a CSS class for visual feedback
  }
  
  function handleDragOver(event) {
    event.preventDefault();
  }
  
  function handleDragEnter(event) {
    event.target.classList.add('dragover'); // Add a CSS class for visual feedback
  }
  
  function handleDragLeave(event) {
    event.target.classList.remove('dragover'); // Remove the CSS class for visual feedback
  }
  
  function allowDrop(event) {
    event.preventDefault();
  }

  function handleImageContextMenu(event) {
    event.preventDefault(); // Prevent the default context menu
  
    var image = event.target;
    var tooltip = document.querySelector('.tooltip')
    tooltip.parentNode.removeChild(tooltip);
    image.parentNode.removeChild(image); // Remove the image element from its parent
  }

  function handleDrop(event) {
    event.preventDefault();
    handleImageMouseOut();
    event.target.classList.remove('dragover'); // Remove the CSS class for visual feedback
  
    if (event.target === draggedElement) {
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
  
  function handleImageMouseOver(event) {
    var image = event.target;
    var imageName = image.itemName.split('.').slice(0, -1).join('.');
    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = imageName;
  
    tooltip.style.visibility = 'hidden'; // Hide the tooltip initially
    image.parentNode.appendChild(tooltip); // Append the tooltip to the image's parent container
  
    // Function to make the tooltip modifiable
    function makeTooltipModifiable() {
      tooltip.contentEditable = true;
      tooltip.focus();
      tooltip.addEventListener('keydown', handleTooltipKeydown);
      tooltip.addEventListener('blur', saveTooltip);
      var range = document.createRange();
      range.selectNodeContents(tooltip);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  
    // Function to handle keydown event on the tooltip
    function handleTooltipKeydown(event) {
      if (event.keyCode === 13) { // Enter key
        event.preventDefault();
        saveTooltip();
      }
    }
  
    // Function to save the tooltip
    function saveTooltip() {
      image.itemName = tooltip.textContent.trim() + '.png';
      tooltip.contentEditable = false;
      tooltip.removeEventListener('keydown', handleTooltipKeydown);
      tooltip.removeEventListener('blur', saveTooltip);
      tooltip.style.top = image.offsetTop - tooltip.offsetHeight - 10 + 'px'; // Position the tooltip above the image
      tooltip.style.left = image.offsetLeft + (image.offsetWidth - tooltip.offsetWidth) / 2 + 'px'; // Center the tooltip horizontally
      tooltip.style.visibility = 'visible'; // Show the tooltip
    }
  
    // Delay the calculation until the tooltip is added to the document
    setTimeout(function() {
      tooltip.style.top = image.offsetTop - tooltip.offsetHeight - 10 + 'px'; // Position the tooltip above the image
      tooltip.style.left = image.offsetLeft + (image.offsetWidth - tooltip.offsetWidth) / 2 + 'px'; // Center the tooltip horizontally
      tooltip.style.visibility = 'visible'; // Show the tooltip
    }, 0);
  
    // Add event listener for double-click event
    image.addEventListener('dblclick', makeTooltipModifiable);
  }
  

  function handleImageMouseOut(event) {
    var tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }
  

  document.addEventListener('dragend', function() {
    draggedElement = null; // Reset the dragged element
  });

  function handleTrashClick() {
    var images = document.querySelectorAll('.tierListImg');
    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      image.parentNode.removeChild(image);
    }
    document.querySelector(".title").value = 'Tier List'
  }
  

  ////////////////////////////////

  // Function to save the tierlist data as a JSON file
  function saveTierlist() {
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
  
  
  
  // Function to load tierlist data from a JSON file
  function loadTierlist(event) {
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
  
        for (var j = 0; j < images.length; j++) {
          var img = document.createElement('img');
          img.src = images[j].src;
          img.className = 'tierListImg';
          img.addEventListener('contextmenu', handleImageContextMenu);
          img.addEventListener('mouseover', handleImageMouseOver);
          img.addEventListener('mouseout', handleImageMouseOut);
          img.addEventListener('dragstart', handleDragStart);
          img.className = 'tierListImg';
          img.itemName = images[j].itemName; // Assign the itemName property to the image element
          itemsDiv.appendChild(img);
        }
  
        ratingDiv.appendChild(ratingInput);
        div.appendChild(ratingDiv);
        div.appendChild(itemsDiv);
        tierlistDiv.appendChild(div);
      }
    };
  
    reader.readAsText(file);
  } 

  // Event listener for the "Save" button
  var saveButton = document.querySelector('.saveBtn');
  saveButton.addEventListener('click', saveTierlist);
  
  // Event listener for the file input to load tierlist data
  var loadInput = document.querySelector('.loadInput');
  loadInput.addEventListener('change', loadTierlist);
  
  