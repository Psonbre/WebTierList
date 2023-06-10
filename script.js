window.addEventListener('DOMContentLoaded', function() {
    var tierlistDiv = document.querySelector('.tierlist');
    var alphabet = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var colors = ['#ff5252', '#ff9f43', '#ffc107', '#4caf50', '#03a9f4', '#673ab7']; // Classic tier list colors

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
        var files = event.target.files;
        var reader;
  
        for (var i = 0; i < files.length; i++) {
          reader = new FileReader();
          reader.onload = (function(file) {
            return function(e) {
              var img = document.createElement('img');
              img.addEventListener('contextmenu', handleImageContextMenu);
              img.addEventListener('mouseover', handleImageMouseOver);
              img.addEventListener('mouseout', handleImageMouseOut);
              img.src = e.target.result;
              img.className = 'tierListImg';
              img.itemName = file.name;
              img.addEventListener('dragstart', handleDragStart);
              document.getElementsByClassName('itemsRow0')[0].appendChild(img);
            };
          })(files[i]);
  
          reader.readAsDataURL(files[i]);
        }
      });
  
      fileInput.click();
    });
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
  
    // Delay the calculation until the tooltip is added to the document
    setTimeout(function() {
      tooltip.style.top = image.offsetTop - tooltip.offsetHeight - 10 + 'px'; // Position the tooltip above the image
      tooltip.style.left = image.offsetLeft + (image.offsetWidth - tooltip.offsetWidth) / 2 + 'px'; // Center the tooltip horizontally
      tooltip.style.visibility = 'visible'; // Show the tooltip
    }, 0);
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
  }
  
  