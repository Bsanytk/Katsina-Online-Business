// Minimal sample data for KOB
(function(){
  window.DATA = {
    products: [
      { id: 'p1', title: 'Kayan Sawa(Dress)', price: 4500, category: 'Fashion', image: 'https://via.placeholder.com/400x300?text=Fashion+1', sellerId: 's1' },
      { id: 'p2', title: 'Mobile Phone', price: 75000, category: 'Electronics', image: 'https://via.placeholder.com/400x300?text=Electronics+1', sellerId: 's2' },
      { id: 'p3', title: 'Kayan abinci - Doya', price: 500, category: 'Food', image: 'https://via.placeholder.com/400x300?text=Food+1', sellerId: 's3' }
    ],
    sellers: [
      { id: 's1', name: 'Aisha Fashion', avatar: 'https://via.placeholder.com/80?text=A', verified: true },
      { id: 's2', name: 'Hassan Electronics', avatar: 'https://via.placeholder.com/80?text=H', verified: true },
      { id: 's3', name: 'Malam Food', avatar: 'https://via.placeholder.com/80?text=M', verified: false }
    ]
  };
})();
