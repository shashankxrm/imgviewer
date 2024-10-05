const image = document.getElementById('image');
const container = document.getElementById('image-container');
let scale = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

// Add smooth transition for zooming
image.style.transition = 'transform 0.3s ease';

// Disable right-click context menu inside the container
container.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

// Function to handle zooming
const zoomImage = (zoomFactor) => {
  const rect = image.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Update scale and limit zoom levels
  const newScale = Math.min(Math.max(scale * zoomFactor, 1), 4); // Zoom between 1x and 4x

  // Calculate the new dimensions of the image
  const newWidth = rect.width * (newScale / scale);
  const newHeight = rect.height * (newScale / scale);

  // Check if the new dimensions would cause the image to exceed the container boundaries
  if (newWidth >= containerRect.width && newHeight >= containerRect.height) {
    // Update scale
    scale = newScale;

    // Apply zoom and keep the image centered
    image.style.transform = `scale(${scale})`;
    image.style.transformOrigin = '50% 50%';  // Ensures zoom happens from the center of the image
  }
};

// Mouse scroll event for zoom
container.addEventListener('wheel', (event) => {
  event.preventDefault();
  const zoomFactor = event.deltaY > 0 ? 0.95 : 1.05; // Adjust zoom factor for smoother zooming
  zoomImage(zoomFactor);
});

// Zoom in and zoom out buttons
document.getElementById('zoom-in').addEventListener('click', () => {
  zoomImage(1.1);
});

document.getElementById('zoom-out').addEventListener('click', () => {
  zoomImage(0.9);
});

// Mouse down event to start dragging
container.addEventListener('mousedown', (event) => {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
  offsetX = image.offsetLeft;
  offsetY = image.offsetTop;
  container.style.cursor = 'grabbing';
});

// Mouse move event to drag the image
container.addEventListener('mousemove', (event) => {
  if (!isDragging) return;

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  // Calculate new position
  const newLeft = offsetX + dx;
  const newTop = offsetY + dy;

  // Apply the translation
  image.style.transform = `translate(${newLeft}px, ${newTop}px) scale(${scale})`;
  image.style.transformOrigin = '50% 50%'; // Maintain zoom from center
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
  isDragging = false;
  container.style.cursor = 'grab';
});

// Center the image initially
window.addEventListener('load', () => {
  image.style.transformOrigin = '50% 50%'; // Set transform origin to the center
});