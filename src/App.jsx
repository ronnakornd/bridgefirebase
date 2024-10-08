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
import NewTeacher from './pages/NewTeacher';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import CourseEditor from './pages/CourseEditor';



function App() {
 
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
              <Route path="/newteacher" element={<NewTeacher />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId/edit" element={<CourseEditor />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
