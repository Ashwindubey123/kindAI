 import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import Writearticle from './pages/Writearticle';
import Blogtitle from './pages/Blogtitle';
import Generateimg from './pages/Generateimg';
import Removebackground from './pages/Removebackground';
import Removeobject from './pages/Removeobject';
import Reviewresume from './pages/Reviewresume';
import Community from './pages/Community';
import { useAuth } from '@clerk/clerk-react';
import {Toaster} from 'react-hot-toast'
const App = () => {
  const { getToken, userId, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      if (!isSignedIn) {
        console.log("🔒 User not signed in");
        return;
      }

      try {
        const token = await getToken();
        console.log("✅ Clerk user ID:", userId);
        console.log("🔐 Token:", token);

        // Optionally send token to backend
        // const res = await fetch("http://localhost:5000/api/ai/generate", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify({
        //     prompt: "Write an article about AI",
        //     length: 100,
        //   }),
        // });
        // const data = await res.json();
        // console.log("🧠 Response from backend:", data);
      } catch (error) {
        console.error("❌ Error getting token or user:", error);
      }
    };

    fetchTokenAndUser();
  }, [getToken, userId, isSignedIn]);

  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='Write-article' element={<Writearticle />} />
          <Route path='blog-titles' element={<Blogtitle />} />
          <Route path='generate-images' element={<Generateimg />} />
          <Route path='Remove-background' element={<Removebackground />} />
          <Route path='Remove-object' element={<Removeobject />} />
          <Route path='Review-resume' element={<Reviewresume />} />
          <Route path='Community' element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
