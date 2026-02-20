// pwa.js – Add to Home Screen with fallback + Service Worker registration
let deferredPrompt;

// Service Worker রেজিস্টার করা
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ Service Worker registered!', reg.scope))
      .catch(err => console.log('❌ Service Worker registration failed:', err));
  });
}

// beforeinstallprompt ইভেন্ট হ্যান্ডল করা
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  const btn = document.getElementById('installBtn');
  if (btn && !window.matchMedia('(display-mode: standalone)').matches) {
    btn.style.display = 'block';
  }
});

window.addEventListener('load', () => {
  const installBtn = document.getElementById('installBtn');
  if (!installBtn) return;

  // যদি ইতিমধ্যে ইন্সটল করা থাকে
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installBtn.style.display = 'none';
    return;
  }

  // বাটন দেখানো
  installBtn.style.display = 'block';

  installBtn.onclick = function() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
          console.log('✅ User installed the app');
          installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      });
    } else {
      alert('📱 Install করতে browser menu ব্যবহার করুন: "Add to Home Screen" (iOS) বা "Install" (Android/Chrome)');
    }
  };
});