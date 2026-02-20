// pwa.js – Add to Home Screen with fallback
let deferredPrompt; // define at top

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show the install button when the event fires (if not already visible)
  const btn = document.getElementById('installBtn');
  if (btn && !window.matchMedia('(display-mode: standalone)').matches) {
    btn.style.display = 'block';
  }
});

window.addEventListener('load', () => {
  const installBtn = document.getElementById('installBtn');
  if (!installBtn) return;

  // If already installed as PWA, hide button permanently
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installBtn.style.display = 'none';
    return;
  }

  // Show button by default (will be hidden on desktop via CSS)
  installBtn.style.display = 'block';

  installBtn.onclick = function() {
    if (deferredPrompt) {
      // Use the saved beforeinstallprompt event
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
          console.log('User installed the app');
          installBtn.style.display = 'none'; // hide after install
        }
        deferredPrompt = null;
      });
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      alert('To install, use browser menu: "Add to Home Screen" (iOS) or "Install" (Android/Chrome).');
    }
  };
});