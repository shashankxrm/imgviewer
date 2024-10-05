const image = document.getElementById('image');
const container = document.getElementById('image-container');
let scale = 1;
let position = { top: 0, left: 0 };
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
const zoomImage = (event, zoomFactor) => {
  const rect = image.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  // Update scale and limit zoom levels
  scale = Math.min(Math.max(scale * zoomFactor, 1), 4); // Zoom between 1x and 4x

  // Apply zoom transformation and scale
  image.style.transform = `translate(${position.left}px, ${position.top}px) scale(${scale})`;
  image.style.transformOrigin = `${offsetX}px ${offsetY}px`;
};

// Mouse scroll event for zoom
container.addEventListener('wheel', (event) => {
  event.preventDefault();
  const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1; // Zoom in or out
  zoomImage(event, zoomFactor);
});

// Zoom in and zoom out buttons
document.getElementById('zoom-in').addEventListener('click', () => {
  zoomImage({ clientX: container.clientWidth / 2, clientY: container.clientHeight / 2 }, 1.1);
});

document.getElementById('zoom-out').addEventListener('click', () => {
  zoomImage({ clientX: container.clientWidth / 2, clientY: container.clientHeight / 2 }, 0.9);
});

// Mouse down event to start dragging
container.addEventListener('mousedown', (event) => {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
  offsetX = position.left;
  offsetY = position.top;
  container.style.cursor = 'grabbing';
});

// Mouse move event to drag the image
container.addEventListener('mousemove', (event) => {
  if (!isDragging) return;

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  // Calculate new position (no constraints)
  position.left = offsetX + dx;
  position.top = offsetY + dy;

  // Apply the transformation
  image.style.transform = `translate(${position.left}px, ${position.top}px) scale(${scale})`;
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
  isDragging = false;
  container.style.cursor = 'grab';
});