// Lightweight auth shim: supports mock local auth and optional Firebase init
(function(){
  const Auth = {
    _user: null,
    _listeners: [],
    init: function(firebaseConfig){
      if(firebaseConfig) {
        window.FIREBASE_CONFIG = firebaseConfig;
        try {
          if(window.firebase && firebase.initializeApp) {
            window.firebaseApp = firebase.initializeApp(firebaseConfig);
            console.log('KOB: Firebase initialized');
          }
        } catch(e){ console.warn('KOB: firebase init failed', e); }
      }
      const s = localStorage.getItem('kob_user');
      if(s) this._user = JSON.parse(s);
    },
    signIn: function(){
      const user = { uid: 'local-' + Date.now(), displayName: 'Local User', email: 'user@example.com', photoURL: '' };
      this._user = user;
      localStorage.setItem('kob_user', JSON.stringify(user));
      this._emit();
      return Promise.resolve(user);
    },
    signOut: function(){
      this._user = null;
      localStorage.removeItem('kob_user');
      this._emit();
      return Promise.resolve();
    },
    onAuthStateChanged: function(cb){
      this._listeners.push(cb);
      cb(this._user);
    },
    _emit: function(){ this._listeners.forEach(cb => cb(this._user)); },
    getCurrentUser: function(){ return this._user; }
  };

  window.Auth = Auth;
  if (window.FIREBASE_CONFIG) Auth.init(window.FIREBASE_CONFIG);
})();
