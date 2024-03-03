import { FaFacebook, FaGoogle, FaDiscord } from "react-icons/fa";
import '../styles/Signin.css';
import { signInWithFacebook } from '../firebase/database';

const Signin = () => {
  const handleFacebookLogin = () => {
    signInWithFacebook();
  };

  return (
    <>
    
    <div className="container-main">
      <p className="upravaTextu">Pro vstup je nutné se nejdříve přihlásit!</p>
      <div className="icons">
      <button onClick={handleFacebookLogin}> 
  <FaFacebook className="hover" />
</button>
      
      <button> 
        <FaGoogle className="hover" />
      </button>

       <button> 
        <FaDiscord className="hover" />
      </button>
      </div>
    </div>
    </>
  );
}

export default Signin;