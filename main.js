const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Function to resize canvas to full screen
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Optional: clear canvas or redraw things here
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Set canvas size when page loads
window.addEventListener('load', resizeCanvas);

// Resize canvas whenever the window size changes
window.addEventListener('resize', resizeCanvas);
