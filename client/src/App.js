import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import React, { useState, Suspense, lazy } from "react";
import WelcomeScreen from './components/Screens/Welcome/WelcomeScreen'
import ProfileScreen from './components/Screens/Profile/ProfileScreen'
import ExploreScreen from './components/Screens/Explore/ExploreScreen'
import CommunityScreen from './components/Screens/CommunityScreen'
import LibraryScreen from './components/Screens/LibraryScreen'
import TilesetEditor from './components/Editors/TilesetEditor'
import MapEditor from './components/Editors/Map Editor/MapEditor'
import ResetPasswordScreen from './components/Screens/ResetPasswordScreen'
import Navbar from './components/Navbar/Navbar'
import SocialSidebar from "./components/SocialSidebar/SocialSidebar";

import './css/app.css';

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="Loading">Loading...</div>}>
          <div className='app-nav-social-container'>
            <Navbar/>
            <SocialSidebar/>
          </div>
          <div className="contentBody">
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
