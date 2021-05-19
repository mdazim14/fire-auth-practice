import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth().signInWithPopup(provider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        // console.log(displayName, email, photoURL);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider)
  .then((res) => {
    var user = res.user;
    console.log('fb user after sign in',user);
  })
  .catch((err) => {
    var errorCode = err.code;
    var errorMessage = err.message;
   var credential = err.credential;
  });
  }

  const handleSignOut = () => {
    // console.log('Sign out Clicked');
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signOutUser = {
          isSignedIn: false,
          name: "",
          photo: "",
          email: "",
          error: "",
          success: false
        };
        setUser(signOutUser);
        console.log(res);
      })
      .catch((err) => {
        // console.log(err.message);
      });
  };
  const handleBlur = (e) => {
    // debugger;
    // console.log(e.target.name, e.target.value);
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      // console.log("email" ,isFieldValid);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
      // console.log("password" , isFieldValid);
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
      // updateUserName(user.name);
    }
  };
  const handleSubmit = (e) => {
    // console.log(user.email , user.password);
    if ( newUser && user.email && user.password) {
      // console.log("submitting");
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          // console.log(res);
          const newUserInfo = {...user};
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })

        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo = {...user};
    newUserInfo.error = "";
    newUserInfo.success = true;
    setUser(newUserInfo);
    
  })
  .catch((error) => {
    const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
  });
    }

    e.preventDefault();
  };

  const updateUserName = (name) => {
    var user = firebase.auth().currentUser;
    user.updateProfile({
        displayName: name,
        })
      .then(function () {
        console.log('user name Updated')
      })
      .catch(function (error) {
        console.log(error)
      });
  };

  return (
    <div className="App">
      <br />
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <button onClick={handleSignIn}>Sign in</button>
      )}
      <br />
      <button onClick={handleFbSignIn}>Sign In using facebook</button>
      <h1>Our own Authentication</h1>
      
      <h2>Name: {user.displayName}</h2>
      <h2>Email: {user.displayName}</h2>
      
      
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign up</label>
      <br />
      {user.isSignedIn && (
        <div>
          <h2>welcome, {user.name}</h2>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        { newUser && <input
          type="text"
          name="name"
          onBlur={handleBlur}
          placeholder="Your Name"
        />}
        <br />
        <input
          type="text"
          name="email"
          onBlur={handleBlur}
          placeholder="Your Email Address"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          onBlur={handleBlur}
          placeholder="Your Password"
          required
        />
        <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success && <p style={{color: 'green'}}>User {newUser ? "created" : "Logged In"} successfully</p>
      }
    </div>
  );
}

export default App;
