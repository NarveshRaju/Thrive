// Suppress browser extension errors
window.addEventListener('error', (e) => {
    if (e.message.includes('message channel closed')) {
      e.preventDefault();
      return true;
    }
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.message?.includes('message channel closed')) {
      e.preventDefault();
      return true;
    }
  });