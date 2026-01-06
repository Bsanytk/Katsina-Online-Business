// Seed localStorage with sample data if absent (non-destructive)
(function(){
  function seed() {
    try {
      if(!localStorage.getItem('kob_products')) {
        localStorage.setItem('kob_products', JSON.stringify(window.DATA.products || []));
      }
      if(!localStorage.getItem('kob_sellers')) {
        localStorage.setItem('kob_sellers', JSON.stringify(window.DATA.sellers || []));
      }
      localStorage.setItem('kob_seeded_at', new Date().toISOString());
      console.log('KOB: seed data applied');
    } catch (e) {
      console.warn('KOB: unable to seed localStorage', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', seed);
  } else {
    seed();
  }
})();
