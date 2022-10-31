import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import React, { useState, Suspense, lazy } from "react";
import WelcomeScreen from './components/Screens/Welcome/WelcomeScreen'
import ProfileScreen from './components/Screens/Profile/ProfileScreen'
import ExploreScreen from './components/Screens/Explore/ExploreScreen'
import CommunityScreen from './components/Screens/CommunityScreen/CommunityScreen'
import LibraryScreen from './components/Screens/LibraryScreen'
import TilesetEditor from './components/Editors/TilesetEditor'
import MapEditor from './components/Editors/Map Editor/MapEditor'
import ResetPasswordScreen from './components/Screens/ResetPasswordScreen'
import Navbar from './components/Navbar/Navbar'
import SocialSidebar from "./components/SocialSidebar/SocialSidebar";
import MyPostsSidebar from "./components/Screens/CommunityScreen/MyPostsSidebar";


import './css/app.css';

const App = () => {
  const [location, setLocation] = useState(window.location.pathname);

  const buildSidebar = () => {
    // if you need to add additional checks for your own sidebar, add them here
    let explore = location.includes('explore');
    let community = location.includes('community');
    let library = location.includes('library');
    let profile = location.includes('profile');
    let tilesetEditor = location.includes('tileset');
    let mapEditor = location.includes('map');
    let resetPassword = location.includes('password');
    if (library || explore) {
      return (
        <SocialSidebar id={1}/>
      );
    }
    else if (community) {
      return (
        <MyPostsSidebar id={1}/>
      );
    }
    return (
      <></>
    );
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="Loading">Loading...</div>}>
          <div className='app-nav-social-container'>
            <Navbar changeLoc={setLocation}/>
            {
              buildSidebar()
            }
          </div>
          <div className={location === '/' || location.includes('profile') ? 'contentBody-nosocial' : "contentBody"}>
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
