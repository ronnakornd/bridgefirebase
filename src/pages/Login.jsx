import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registered successfully');
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      alert(error.message);
    }
  };

  return (
    <div className="container flex justify-center flex-col items-center mx-auto pt-40 pb-20 px-5">
      <h1 className="text-2xl w-3/4 font-bold mb-4">{isRegistering ? 'Register' : 'Login'}</h1>
      <div className="form-control mb-4 w-3/4">
        <label className="label" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="input input-bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-control mb-4 w-3/4">
        <label className="label" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="input input-bordered"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-control mb-4 w-2/4">
        {isRegistering ? (
          <button className="btn btn-primary" onClick={handleRegister}>Register</button>
        ) : (
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        )}
      </div>
      <div className="form-control mb-4 w-2/4">
        <button className="btn btn-secondary" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
      <div className="form-control w-2/4">
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Login;
