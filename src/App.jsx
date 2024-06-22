import { useState } from 'react'
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Layout from './Layout';
import NoPage from './pages/NoPage';
import NewPost from './pages/NewPost';
import BlogList from './pages/BlogList';
import Post from './pages/Post';
import EditPost from './pages/EditPost';




function App() {
  const [count, setCount] = useState(0)

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
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
