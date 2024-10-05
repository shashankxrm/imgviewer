const container = document.getElementById('container');
const image = document.getElementById('image');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');

let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;
const zoomSensitivity = 0.05; // Adjusted zoom sensitivity
const maxScale = 5; // Maximum zoom level

// Prevent image from being downloaded or dragged
image.addEventListener('contextmenu', (e) => e.preventDefault());
image.addEventListener('dragstart', (e) => e.preventDefault());

zoomInButton.addEventListener('click', () => {
    scale = Math.min(scale + zoomSensitivity, maxScale);
    updateTransform();
});

zoomOutButton.addEventListener('click', () => {
    scale = Math.max(scale - zoomSensitivity, 0.1);
    updateTransform();
});

container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - originX;
    startY = e.clientY - originY;
    image.style.cursor = 'grabbing';
});

container.addEventListener('mousemove', (e) => {
    if (isDragging) {
        originX = e.clientX - startX;
        originY = e.clientY - startY;
        updateTransform();
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    image.style.cursor = 'grab';
});

document.addEventListener('mouseleave', () => {
    isDragging = false;
    image.style.cursor = 'grab';
});


container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = image.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
    const newScale = Math.min(Math.max(scale + delta, 0.1), maxScale);

    // Calculate the new origin to keep the zoom centered on the cursor
    const scaleRatio = newScale / scale;
    originX = offsetX - (offsetX - originX) * scaleRatio;
    originY = offsetY - (offsetY - originY) * scaleRatio;

    scale = newScale;
    updateTransform();
});

function updateTransform() {
    const containerRect = container.getBoundingClientRect();
    const scaledWidth = image.naturalWidth * scale;  // Use the image's natural size for scaling
    const scaledHeight = image.naturalHeight * scale;

    // Calculate boundaries based on the scaled size of the image
    const minX = containerRect.width - scaledWidth;  // The right edge of the image should not go beyond the container
    const maxX = 0;  // The left edge of the image should not go beyond the container
    const minY = containerRect.height - scaledHeight;  // The bottom edge of the image should not go beyond the container
    const maxY = 0;  // The top edge of the image should not go beyond the container

    // Adjust originX based on whether the image is larger or smaller than the container
    if (scaledWidth > containerRect.width) {
        // If the image is zoomed in (larger than the container), allow free movement within bounds
        originX = Math.max(minX, Math.min(originX, maxX));
    } else {
        // If the image is zoomed out (smaller than the container), center it horizontally
        originX = (containerRect.width - scaledWidth) / 2;
    }

    // Adjust originY based on whether the image is larger or smaller than the container
    if (scaledHeight > containerRect.height) {
        // If the image is zoomed in (larger than the container), allow free movement within bounds
        originY = Math.max(minY, Math.min(originY, maxY));
    } else {
        // If the image is zoomed out (smaller than the container), center it vertically
        originY = (containerRect.height - scaledHeight) / 2;
    }

    // Apply the transform
    image.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
}



