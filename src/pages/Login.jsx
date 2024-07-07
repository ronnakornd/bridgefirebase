import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging in:', error);
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

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };


  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Add additional fields to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
        role: role, // Add role field
        createdAt: new Date()
      });
      alert('Registered successfully');
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto pt-40 pb-20">
      <h1 className="text-2xl font-bold mb-4">{isRegistering ? 'Register' : 'Login'}</h1>
      {isRegistering && (
        <div className="form-control mb-4">
          <label className="label" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="input input-bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      )}
       {isRegistering && (
        <div className="form-control mb-4">
          <label className="label" htmlFor="username">Username</label>
          <select
            type="text"
            id="role"
            className="select select-bordered"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            >
              <option value="instructor">ผู้สอน</option>
              <option value="student">ผู้เรียน</option>
              <option value="parent">ผู้ปกครอง</option>
          </select>
        </div>
      )}
      <div className="form-control mb-4">
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
      <div className="form-control mb-4">
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
      
      <div className="form-control mb-4">
        {isRegistering ? (
          <button className="btn btn-primary" onClick={handleRegister}>Register</button>
        ) : (
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        )}
      </div>
      <div className="form-control mb-4">
        <button className="btn btn-warning" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
      <div className="form-control">
        <button className="btn btn-error" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Login;
