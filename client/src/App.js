import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import React, { useState, Suspense, lazy } from "react";
import WelcomeScreen from './components/Screens/WelcomeScreen'
import ProfileScreen from './components/Screens/ProfileScreen'
import ExploreScreen from './components/Screens/ExploreScreen'
import CommunityScreen from './components/Screens/CommunityScreen'
import LibraryScreen from './components/Screens/LibraryScreen'
import TilesetEditor from './components/TilesetEditor'
import MapEditor from './components/MapEditor'
import ResetPasswordScreen from './components/Screens/ResetPasswordScreen'
import Navbar from './components/Navbar/Navbar'
import SocialSidebar from "./components/SocialSidebar/SocialSidebar";

import './css/app.css';

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="Loading">Loading...</div>}>
        <div>
          <div className='app-nav-social-container'>
            <Navbar />
            <SocialSidebar id={1} />
          </div>
          <div className='app-main-content'>
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/profile/" element={<ProfileScreen />} />
              <Route path="/explore/" element={<ExploreScreen />} />
              <Route path="/library/" element={<LibraryScreen />} />
              <Route path="/community/" element={<CommunityScreen />} />

              <Route
                path="/tileset/:id"
                element={<TilesetEditor />}
              />
              <Route
                path="/map/:id"
                element={<MapEditor />}
              />

              <Route path="/reset-password/:id/:token" element={<ResetPasswordScreen />} />
            </Routes>
          </div>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
