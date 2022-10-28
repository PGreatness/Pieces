import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import React, { useState, Suspense, lazy } from "react";
import WelcomeScreen from './components/WelcomeScreen'
import ProfileScreen from './components/ProfileScreen'
import ExploreScreen from './components/ExploreScreen'
import CommunityScreen from './components/CommunityScreen'
import LibraryScreen from './components/LibraryScreen'
import TilesetEditor from './components/TilesetEditor'
import MapEditor from './components/MapEditor'
import ResetPasswordScreen from './components/ResetPasswordScreen'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="Loading">Loading...</div>}>
        <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<WelcomeScreen/>}/>
          <Route path="/profile/" element={<ProfileScreen/>}/>
          <Route path="/explore/" element={<ExploreScreen/>}/>
          <Route path="/library/" element={<LibraryScreen/>}/>
          <Route path="/community/" element={<CommunityScreen/>}/>

          <Route
            path="/tileset/:id"
            element={<TilesetEditor/>}
          />
          <Route
            path="/map/:id"
            element={<MapEditor/>}
          />

          <Route path="/reset-password/:id/:token" element={<ResetPasswordScreen/>}/>
        </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
