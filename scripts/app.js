// Main UI behavior: renders products/sellers, handles search/filter and contact form
(function(){
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

  const productGrid = $('#productGrid');
  const sellerGrid = $('#sellerGrid');
  const searchInput = $('#searchInput');
  const categoryFilter = $('#categoryFilter');
  const productEmpty = $('#productEmpty');
  const loginBtn = $('#loginBtn');
  const logoutBtn = $('#logoutBtn');
  const userBadge = $('#userBadge');
  const userName = $('#userName');
  const userAvatar = $('#userAvatar');
  const contactForm = $('#contactForm');
  const contactStatus = $('#contactStatus');

  function loadProducts(){
    try {
      const raw = localStorage.getItem('kob_products');
      return raw ? JSON.parse(raw) : (window.DATA && window.DATA.products) || [];
    } catch(e){ return (window.DATA && window.DATA.products) || []; }
  }

  function loadSellers(){
    try {
      const raw = localStorage.getItem('kob_sellers');
      return raw ? JSON.parse(raw) : (window.DATA && window.DATA.sellers) || [];
    } catch(e){ return (window.DATA && window.DATA.sellers) || []; }
  }

  function renderProducts(items){
    productGrid.innerHTML = '';
    if(!items.length){ productEmpty.classList.remove('hidden'); return; }
    productEmpty.classList.add('hidden');
    items.forEach(p => {
      const div = document.createElement('div');
      div.className = 'bg-white rounded shadow p-4';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.title}" class="w-full h-40 object-cover rounded mb-3">
        <h3 class="font-semibold">${p.title}</h3>
        <p class="text-sm text-gray-600">${p.category} • ₦${p.price}</p>
        <div class="mt-3 flex justify-between items-center">
          <button class="bg-primary text-white px-3 py-1 rounded">Sayi</button>
          <button class="text-sm text-gray-600 view-seller" data-seller="${p.sellerId}">Duba Masu sayarwa</button>
        </div>
      `;
      productGrid.appendChild(div);
    });
  }

  function renderSellers(){
    const sellers = loadSellers();
    sellerGrid.innerHTML = '';
    sellers.forEach(s => {
      const div = document.createElement('div');
      div.className = 'bg-white rounded shadow p-4 flex items-center gap-4';
      div.innerHTML = `
        <img src="${s.avatar}" alt="${s.name}" class="w-16 h-16 rounded-full">
        <div>
          <div class="font-semibold">${s.name} ${s.verified ? '<span class="text-xs text-green-600">✓</span>' : ''}</div>
        </div>
      `;
      sellerGrid.appendChild(div);
    });
  }

  function filterAndRender(){
    const q = (searchInput.value || '').toLowerCase().trim();
    const cat = (categoryFilter.value || '').trim();
    let items = loadProducts();
    if(cat) items = items.filter(i => i.category === cat);
    if(q) items = items.filter(i => (i.title + ' ' + i.category).toLowerCase().includes(q));
    renderProducts(items);
  }

  function updateAuthUI(user){
    if(user){
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
      userBadge.classList.remove('hidden');
      userName.textContent = user.displayName || user.email || 'Member';
      userAvatar.src = user.photoURL || 'https://via.placeholder.com/80?text=U';
    } else {
      loginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
      userBadge.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderProducts(loadProducts());
    renderSellers();

    searchInput.addEventListener('input', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);

    if(window.Auth && Auth.onAuthStateChanged){
      Auth.onAuthStateChanged(updateAuthUI);
    }

    loginBtn.addEventListener('click', function(){
      if(window.Auth && Auth.signIn){ Auth.signIn(); }
    });
    logoutBtn.addEventListener('click', function(){ if(window.Auth && Auth.signOut) Auth.signOut(); });

    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = $('#contactName').value.trim();
      const email = $('#contactEmail').value.trim();
      const message = $('#contactMessage').value.trim();
      const payload = { name, email, message, createdAt: new Date().toISOString() };

      // If firebase is available and firestore exists, try to write
      if(window.firebase && firebase.firestore){
        try {
          const db = firebase.firestore();
          db.collection('messages').add(payload).then(()=>{
            contactStatus.textContent = 'Saƙon ya samu; mun gode.';
            contactForm.reset();
          }).catch(err => { contactStatus.textContent = 'Akwai matsala; an ajiye a gida.'; storeLocal(); });
        } catch(e){ storeLocal(); }
      } else {
        storeLocal();
      }

      function storeLocal(){
        try {
          const msgs = JSON.parse(localStorage.getItem('kob_messages')||'[]');
          msgs.push(payload);
          localStorage.setItem('kob_messages', JSON.stringify(msgs));
          contactStatus.textContent = 'Saƙon an ajiye (na gida).';
          contactForm.reset();
        } catch(e){ contactStatus.textContent = 'Aika ya kasa.'; }
      }
    });
  });
})();
