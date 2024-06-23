import { useState , useEffect} from 'react'
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import './App.css'
import Home from './pages/Home';
import Layout from './Layout';
import NoPage from './pages/NoPage';
import NewPost from './pages/NewPost';
import BlogList from './pages/BlogList';
import Post from './pages/Post';
import EditPost from './pages/EditPost';
import Login from './pages/Login';




function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/newpost" element={<NewPost />} />
              <Route path="/bloglist" element={<BlogList />} /> 
              <Route path="/post/:id" element={<Post />} />
              <Route path="/editpost/:id" element={<EditPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
