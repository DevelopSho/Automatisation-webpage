import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAMoHJZ4x_O69IorMH7qx3exGkJY8_hUs8",
  authDomain: "newsletter---sho.firebaseapp.com",
  projectId: "newsletter---sho",
  storageBucket: "newsletter---sho.appspot.com",
  messagingSenderId: "1038532280834",
  appId: "1:1038532280834:web:ae9bc5dafd8e94100ddd1b"
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const userId = '10217740565665081'; // Tvoje ID
const redirectPage = '/Newsletter'; // Uprav na skutečnou cílovou 

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Uživatel je přihlášen
    console.log("Uživatel je přihlášen:", user);
  } else {
    // Uživatel není přihlášen
    console.log("Uživatel není přihlášen");
  }
});

const signInWithFacebook = () => {
  const provider = new firebase.auth.FacebookAuthProvider();

  provider.setCustomParameters({
    auth_type: 'reauthenticate',
    state: userId,
  });

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      // Po úspěšném přihlášení nebo reautentikaci provede přesměrování na cílovou stránku
      window.location.href = redirectPage;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

    

};

export { projectFirestore, signInWithFacebook,};
