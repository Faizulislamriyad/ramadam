// Show button regardless of beforeinstallprompt (with fallback message)
window.addEventListener('load', () => {
  // Check if already installed (display-mode: standalone)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    // Already installed, hide button
    document.getElementById('installBtn').style.display = 'none';
  } else {
    // Show button, but change behavior based on support
    document.getElementById('installBtn').style.display = 'block';
    document.getElementById('installBtn').onclick = function() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      } else {
        alert('To install, use browser menu: "Add to Home Screen" (iOS) or "Install" (Android/Chrome).');
      }
    };
  }
});