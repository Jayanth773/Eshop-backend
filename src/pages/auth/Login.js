import {useState} from 'react';
import styles from "./Auth.module.scss";
import loginImg from "../../assets/login.png"
import { Link, useNavigate } from 'react-router-dom';
import {FaGoogle} from "react-icons/fa"
import Card from '../../components/card/Card';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup  } from "firebase/auth";
import { auth } from '../../firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import { useSelector } from 'react-redux';
import { selectPreviousURL } from '../../redux/slice/cartSlice';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const previousURL = useSelector(selectPreviousURL)
    const navigate = useNavigate();

    const redirectUser = () => {
      if(previousURL.includes("cart")){
        return navigate("/cart")
      }else {
        navigate("/")
      }
    }

    const loginUser = (event) => {
      event.preventDefault();
      setIsLoading(true)

      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //const user = userCredential.user;
        setIsLoading(false)
        toast.success("Login Successful...")
        redirectUser()
      })
      .catch((error) => {
        setIsLoading(false)
        toast.error(error.message)
      });
    }

    //Login with Google
    const provider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
    .then((result) => {
      //const user = result.user;
      toast.success("Login Successfully.")
      redirectUser()
    }).catch((error) => {
    toast.error(error.message)
    });
    }

  return(
    <>
    <ToastContainer />
    {isLoading && <Loader />}
    <section className={`container ${styles.auth}`}>
      <div className={styles.img}>
        <img src={loginImg} alt="Login" width="400px"/>
      </div>
      <Card>
        <div className={styles.form}>
          <h2>Login</h2>
          <form onSubmit={loginUser}>
            <input 
              type="text" 
              placeholder="Email" 
              required 
              value={email} 
              onChange={(event) => setEmail(event.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password} 
              onChange={(event) => setPassword(event.target.value)}
            />

            <button className="--btn --btn-primary --btn-block">Login</button>
            <div className={styles.links}>
              <Link to="/reset">Reset Password</Link>
            </div>
            <p>-- or --</p>
          </form>
          <button type='submit' className="--btn --btn-danger --btn-block" onClick={signInWithGoogle}>
            <FaGoogle color="#fff" size="15"/>
            Login With Google
          </button>
          <span className={styles.register}>
            <p>Don't have an account?</p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </section>
    </>
  )
}

export default Login