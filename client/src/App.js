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
        <Navbar/>
        <Routes>
          <Route path="/" exact component={WelcomeScreen}/>
          <Route path="/profile/" exact component={ProfileScreen}/>
          <Route path="/explore/" exact component={ExploreScreen}/>
          <Route path="/library/" exact component={LibraryScreen}/>
          <Route path="/community/" exact component={CommunityScreen}/>

          <Route
            path="/tileset/:id"
            exact component={TilesetEditor}
          />
          <Route
            path="/map/:id"
            exact component={MapEditor}
          />

          <Route path="/reset-password/:id/:token" exact component={ResetPasswordScreen}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
