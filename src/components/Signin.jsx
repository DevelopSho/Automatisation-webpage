import {FaGoogle } from "react-icons/fa";
import { signInWithGoogle } from '../firebase/database'; 
import '../styles/Signin.css';

const Signin = () => {
  const handleGoogleSignIn = () => {
    signInWithGoogle(); // Zavolání funkce pro přihlášení přes Google
  };

  return (
    <>
      <div className="container-main">
        <p className="upravaTextu">Pro vstup je nutné se nejdříve přihlásit!</p>
        <div className="icons-signin">
          <button onClick={handleGoogleSignIn}>
            <FaGoogle className="hover" />
          </button>

          {/* Případně můžete přidat i další tlačítka pro jiné platformy */}
          {/* <button> 
            <FaFacebook className="hover" />
          </button>
          <button> 
            <FaDiscord className="hover" />
          </button> */}
        </div>
      </div>
    </>
  );
}

export default Signin;