import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-AUTH-DOMAIN",
  projectId: "YOUR-PROJEKT-ID",
  storageBucket: "YOUR-STORAGE-BUCKET",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ADI"
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const redirectPage = '/Newsletter'; 
const homePage = '/'; // Úvodní stránka, kam přesměrovat, pokud uživatel není povolen

const allowedUserId = 'ALLOWED-USER-ID-FROM-YOUR-ACCOUNT-FIREBASE';

firebase.auth().onAuthStateChanged((user) => {
  // Pokud uživatel není přihlášen, přesměrovat na úvodní stránku
  if (!user) {
    // Pokud již na úvodní stránce, neměníme URL
    if (window.location.pathname !== homePage) {
      window.location.href = homePage;
    }
    return;
  }

  // Pokud UID není shodné s povoleným UID, přesměrovat na úvodní stránku
  if (user.uid !== allowedUserId) {
    console.log("Přístup zamítnut.");
    // Pouze přesměrování, pokud uživatel není již na úvodní stránce
    if (window.location.pathname !== homePage) {
      window.location.href = homePage;
    }
    return;
  }

  // Zde můžete provádět další kroky pro povoleného uživatele
  console.log("Přístup povolen pro uživatele:", user.displayName);
});

const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      // Přihlášení by nemělo být úspěšné, pokud uživatel nemá shodné UID
      console.error("Nemělo by se sem dostat.");
      window.location.href = redirectPage;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      // Zde můžete přidat kód pro neplatné přihlášení
      if (errorCode === "auth/user-not-found") {
        console.log("Uživatel nebyl nalezen.");
        // Provádět kroky pro neplatné přihlášení
      } else {
        console.log("Nastala chyba při přihlášení.");
        // Provádět kroky pro ostatní chyby při přihlášení
      }

      // Přidáno: Přesměrování pouze pokud není administrativní stránka
      if (!window.location.pathname.includes('/admin')) {
        window.location.href = homePage;
      }
    });
};

export { projectFirestore, signInWithGoogle };
