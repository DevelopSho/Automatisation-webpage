import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Button from 'react-bootstrap/Button';
import '../styles/Tlacitko.css'


const SignOut = () => {
  firebase.auth().signOut()
    .then(() => {
      console.log("Uživatel odhlášen");
      // Přesměrování na úvodní stránku nebo jinou cílovou stránku
      window.location.href = '/';
    })
    .catch((error) => {
      console.log("Chyba při odhlašování", error);
    });
};

const LogoutButton = () => {
  const handleLogout = () => {
    if (firebase.auth().currentUser) {
      SignOut();
    }
  };

  return (
    <>
    <Button variant="danger" onClick={handleLogout}>
      Odhlásit se
    </Button>
 
    </>
  );
};

export default LogoutButton;