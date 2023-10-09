import { loadFromJson } from "./tierlist.js";

const repoOwner = 'psonbre';
const repoName = 'webtierlistdb';
const ken = "EFPSWJvXx3Unnx3xvXQX"
const to = "MVHS50BHYOg20LnV" 

let host = "https://github.com/Psonbre/WebTierList";
async function sha1(data) {
    let buffer = new TextEncoder("utf-8").encode(data);
    return crypto.subtle.digest("SHA-1", buffer).then(function(hash) {
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
    });
}

async function getFileSha(filePath) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`);
        return response.data.sha;
    } catch (error) {
        return null;
    }
}

export async function uploadTierlist() {
    const tierlistData = getTierlistAsJson();
    const jsonData = JSON.stringify(tierlistData);
    const hash = await sha1(jsonData);
    const filePath = `${hash}.json`;
    const fileContent = jsonData;

    const sha = await getFileSha(filePath);
    const content = btoa(unescape(encodeURIComponent(fileContent)));

    const data = {
        message: 'Upload Tierlist',
        content: content,
        ...(sha ? { sha: sha } : {})
    };

    try {
        const response = await axios.put(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, data, {
            headers: {
                'Authorization': `token ghp_${to+ken}`
            }
        });
        Swal.fire({
            title: '<span class="white-title">Success!</span>',
            html: `
              <div class="dark-mode-popup">
                Tierlist uploaded successfully! 
                <input type="text" id="tierlistLink" class="swal2-input" value="${host}?id=${hash}" readonly>
                <button class="swal2-confirm swal2-styled copyBtn" id="copyButton">Copy Link</button>
              </div>
            `,
            showCancelButton: true,
            showConfirmButton: false,
            customClass: {
              popup: 'dark-mode-popup',
              content: 'dark-mode-content',
            }
          });
        
        document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    } catch (error) {
        console.error('Error uploading tierlist:', error.response.data.message);
        alert('Error uploading tierlist. Please try again later.');
    }
}

export function getTierlistAsJson() {
    var tierlistData = [];
    var rows = document.getElementsByClassName('row');
    var title = document.querySelector('.title').value;
  
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var rating = row.querySelector('.rating').value;
      var images = Array.from(row.getElementsByClassName('tierListImg')).map(function (img) {
        return {
          src: img.src,
          itemName: img.itemName
        };
      });
  
      tierlistData.push({
        rating: rating,
        images: images
      });
    }
  
    return JSON.stringify({ title: title, tiers: tierlistData }, null, 2);
}

function copyToClipboard() {
    const copyText = document.getElementById("tierlistLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    Swal.fire({
      title: 'Copied!',
      text: 'Link copied to clipboard.',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
}

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to load a tierlist from the given ID
async function loadTierlistFromId(id) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${id}.json`);
        const content = response.data.content;
        const tierlistData = JSON.parse(atob(content)); // Decode and parse the content
        return tierlistData;
    } catch (error) {
        console.error('Error loading tierlist:', error);
        return null;
    }
}

// Function to initialize the tierlist from the URL parameter
export async function initTierlistFromUrl() {
    const id = getUrlParameter('id');
    if (id) {
        let tierlistData = await loadTierlistFromId(id);
        if (tierlistData) {
            tierlistData = JSON.parse(tierlistData);
            loadFromJson(tierlistData)
        } else {
            console.error('Tierlist not found with ID:', id);
            // Handle the case where the tierlist is not found.
        }
    }
}
  

