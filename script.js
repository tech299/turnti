// Variables to store user settings
let userSettings = {
  charSet: '@#%*+=-:. ',
  scale: 200, // Default width in characters
  colorEnabled: true,
  backgroundColor: '#212F3D',
  fontSize: 8
};

// Event listeners
document.getElementById('generate-button').addEventListener('click', generateASCII);

// Function to generate ASCII art from the uploaded image
function generateASCII() {
  const file = document.getElementById('image-input').files[0];
  if (!file) {
    alert('Please select an image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function() {
      processImage(img);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function processImage(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Adjust canvas size based on user settings
  const maxWidth = userSettings.scale;
  const aspectRatio = img.width / img.height;
  const canvasWidth = maxWidth;
  const canvasHeight = canvasWidth / aspectRatio;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const ascii = convertToASCII(imageData);
  const asciiContainer = document.getElementById('ascii-container');

  // Clear previous content
  asciiContainer.innerHTML = '';

  // Apply background color
  asciiContainer.style.backgroundColor = userSettings.backgroundColor;

  // Append the ASCII art
  const asciiContent = document.createElement('div');
  asciiContent.classList.add('ascii-art');
  asciiContent.innerHTML = ascii;
  asciiContainer.appendChild(asciiContent);

  // Set font size dynamically
  asciiContainer.style.setProperty('--ascii-font-size', `${userSettings.fontSize}px`);
  asciiContainer.style.setProperty('--ascii-line-height', `${userSettings.fontSize}px`);

  // Ensure the ASCII art is visible
  asciiContainer.style.display = 'block';

  // Display sidebar when ASCII art is generated
  document.getElementById('sidebar').style.display = 'block';

  // Add ASCII art to gallery
  addAsciiArtToGallery(ascii);

  // Display a rotating fact
  displayFact();
}

// Function to convert image data to ASCII art
function convertToASCII(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const charList = userSettings.charSet;
  let asciiImage = '';

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      // Calculate brightness
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
      const charIndex = Math.floor((brightness / 255) * (charList.length - 1));
      const character = charList[charIndex];

      // Add character with or without color
      if (userSettings.colorEnabled) {
        line += `<span style="color: rgb(${r},${g},${b});">${character}</span>`;
      } else {
        line += character;
      }
    }
    asciiImage += line + '\n';
  }

  return asciiImage;
}

// Function to apply settings from the Settings panel
function applySettings() {
  userSettings.charSet = document.getElementById('char-set').value;
  userSettings.scale = parseInt(document.getElementById('scale-range').value, 10);
  userSettings.colorEnabled = document.getElementById('color-toggle').checked;
  userSettings.backgroundColor = document.getElementById('background-color').value;
  userSettings.fontSize = parseInt(document.getElementById('font-size-range').value, 10);

  // Re-generate the ASCII art with updated settings
  generateASCII();
}

// Function to navigate between sections
function showSection(sectionId) {
  const sections = document.querySelectorAll('main > section');
  sections.forEach(section => {
    section.style.display = section.id === sectionId ? 'block' : 'none';
  });
}

// Function to add generated ASCII art to the gallery
function addAsciiArtToGallery(asciiArt) {
  const galleryGrid = document.querySelector('.gallery-grid');

  // Create a new gallery item
  const galleryItem = document.createElement('div');
  galleryItem.classList.add('gallery-item');

  // Create a container for the ASCII art thumbnail
  const asciiArtContainer = document.createElement('div');
  asciiArtContainer.classList.add('ascii-art-thumbnail');
  asciiArtContainer.innerHTML = asciiArt;

  // Add click event to view the ASCII art in the home section
  asciiArtContainer.addEventListener('click', function() {
    displayAsciiArtInHome(asciiArt);
    showSection('home');
  });

  galleryItem.appendChild(asciiArtContainer);
  galleryGrid.appendChild(galleryItem);
}

// Function to display ASCII art in the home section
function displayAsciiArtInHome(asciiArt) {
  const asciiContainer = document.getElementById('ascii-container');

  // Clear previous content
  asciiContainer.innerHTML = '';

  // Append the ASCII art
  const asciiContent = document.createElement('div');
  asciiContent.classList.add('ascii-art');
  asciiContent.innerHTML = asciiArt;
  asciiContainer.appendChild(asciiContent);

  // Apply background color and font size
  asciiContainer.style.backgroundColor = userSettings.backgroundColor;
  asciiContainer.style.setProperty('--ascii-font-size', `${userSettings.fontSize}px`);
  asciiContainer.style.setProperty('--ascii-line-height', `${userSettings.fontSize}px`);

  // Ensure the ASCII art is visible
  asciiContainer.style.display = 'block';
}

// Rotating facts function
function displayFact() {
  const facts = [
    "Did you know? The first ASCII art was created in the 1960s.",
    "Fun fact: ASCII stands for American Standard Code for Information Interchange.",
    "ASCII art was often used in email signatures back in the early days of the internet.",
    "Early computer graphics relied heavily on ASCII art for visual representation."
  ];

  const factContainer = document.getElementById('rotating-facts');
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  
  factContainer.textContent = randomFact;
}

// Accessibility: Enable keyboard navigation for navigation links
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  });
});
