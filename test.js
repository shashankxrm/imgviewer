const image = document.getElementById('image');
const container = document.getElementById('image-container');
let scale = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

const CONTAINER_WIDTH = 1000;
const CONTAINER_HEIGHT = 800;

// Add smooth transition for zooming
image.style.transition = 'transform 0.3s ease';

// Disable right-click context menu inside the container
container.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

// Function to calculate the initial scale to fit the image in the container
const calculateInitialScale = () => {
  const containerAspectRatio = CONTAINER_WIDTH / CONTAINER_HEIGHT;
  const imageAspectRatio = image.naturalWidth / image.naturalHeight;

  if (imageAspectRatio > containerAspectRatio) {
    // Image is wider than container, fit based on width
    return CONTAINER_WIDTH / image.naturalWidth;
  } else {
    // Image is taller than container, fit based on height
    return CONTAINER_HEIGHT / image.naturalHeight;
  }
};

// Function to calculate the maximum allowed scale
const calculateMaxScale = () => {
  return Math.max(
    CONTAINER_WIDTH / image.naturalWidth,
    CONTAINER_HEIGHT / image.naturalHeight,
    2 // Set a minimum max scale, e.g., 2x
  );
};

// Function to handle zooming
const zoomImage = (zoomFactor) => {
  const initialScale = calculateInitialScale();
  const maxScale = calculateMaxScale();
  const newScale = Math.min(Math.max(scale * zoomFactor, initialScale), maxScale);

  if (newScale === scale) {
    return; // No change in scale, so return early
  }

  scale = newScale;

  // Reset translation when zooming out to initial scale
  if (scale === initialScale) {
    translateX = 0;
    translateY = 0;
  }

  updateImageTransform();
};

// Function to update image transform and prevent over-panning
const updateImageTransform = () => {
  const imageWidth = image.naturalWidth * scale;
  const imageHeight = image.naturalHeight * scale;

  // Calculate the maximum translation values to prevent over-panning
  const maxTranslateX = Math.max(0, (imageWidth - CONTAINER_WIDTH) / 2);
  const maxTranslateY = Math.max(0, (imageHeight - CONTAINER_HEIGHT) / 2);

  // Prevent over-panning by clamping translateX and translateY within bounds
  translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
  translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));

  // Apply the translation and scaling
  image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
};

// Center the image on initial load
const centerImage = () => {
  const initialScale = calculateInitialScale();
  scale = initialScale;

  const imageWidth = image.naturalWidth * scale;
  const imageHeight = image.naturalHeight * scale;

  // Center the image by calculating the translateX and translateY
  translateX = (CONTAINER_WIDTH - imageWidth) / 2;
  translateY = (CONTAINER_HEIGHT - imageHeight) / 2;

  updateImageTransform();
};

// Mouse scroll event for zoom
container.addEventListener('wheel', (event) => {
  event.preventDefault();
  const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
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
  startX = event.clientX - translateX;
  startY = event.clientY - translateY;
  container.style.cursor = 'grabbing';
});

// Mouse move event to drag the image
container.addEventListener('mousemove', (event) => {
  if (!isDragging) return;

  const newTranslateX = event.clientX - startX;
  const newTranslateY = event.clientY - startY;

  translateX = newTranslateX;
  translateY = newTranslateY;

  updateImageTransform();
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
  isDragging = false;
  container.style.cursor = 'grab';
});

// Initialize the image and center it
window.addEventListener('load', () => {
  image.onload = () => {
    centerImage();
  };
});
