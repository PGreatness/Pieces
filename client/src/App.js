import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import React, { useState, useContext, Suspense, lazy } from "react";
import WelcomeScreen from './components/Screens/Welcome/WelcomeScreen'
import ProfileScreen from './components/Screens/Profile/ProfileScreen'
import ExploreScreen from './components/Screens/Explore/ExploreScreen'
import CommunityScreen from './components/Screens/CommunityScreen/CommunityScreen'
import LibraryScreen from './components/Screens/Library/LibraryScreen'
import TilesetEditor from './components/Editors/Tileset Editor/TilesetEditor'
import ResetPasswordScreen from './components/ResetPassword/ResetPassword'
import MapEditor from './components/Editors/Map Editor/MapEditor'
import Navbar from './components/Navbar/Navbar'
import SocialSidebar from "./components/SocialSidebar/SocialSidebar";
import MyPostsSidebar from "./components/Screens/CommunityScreen/MyPostsSidebar";
import CreateButton from "./components/CreateButton/CreateButton";
import { AuthContextProvider } from './auth/auth';
import { GlobalStoreContextProvider } from './store/store';
import { CommunityStoreContextProvider } from './store/communityStore';
import './css/app.css';

const App = () => {
  //const { store } = useContext(GlobalStoreContext);
  //const {auth} = useContext(AuthContext);
  const [location, setLocation] = useState(window.location.pathname);

  const buildSidebar = () => {

    // if you need to add additional checks for your own sidebar, add them here
    let explore = location.includes('explore');
    let community = location.includes('community');
    let library = location.includes('library');
    let profile = location.includes('profile');
    let tilesetEditor = location.includes('tileset');
    let mapEditor = location.includes('map');
    if (library || explore) {
      return (
        <SocialSidebar id={1} />
      );
    }
    else if (community) {
      return (
        <MyPostsSidebar />
      );
    }
    return (
      <></>
    );
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="Loading">Loading...</div>}>
        <AuthContextProvider>
          <GlobalStoreContextProvider>
            <CommunityStoreContextProvider>

              {
                location.includes('explore') || location.includes('library') ? <CreateButton setLoc={setLocation} /> : <></>
              }
              <div className='app-nav-social-container'>
                <Navbar changeLoc={setLocation} reset={location.includes('reset-password') ? true : false} />
                {
                  buildSidebar()
                }
              </div>
              <div className={(location === '/' || location.includes('profile') || location.includes('reset-password') ||
                location.includes('map') || location.includes('tileset')) ? 'contentBody-nosocial' : "contentBody"}>
                <Routes>
                  <Route path="/" element={<WelcomeScreen />} />
                  <Route path="/reset-password/:id/:token" element={<ResetPasswordScreen />} />
                  <Route path="/profile/" element={<ProfileScreen />} />
                  <Route path="/explore/" element={<ExploreScreen setLoc={setLocation} />} />
                  <Route path="/library/" element={<LibraryScreen setLoc={setLocation} />} />
                  <Route path="/community/" element={<CommunityScreen />} />

                  <Route
                    path="/tileset/:id"
                    element={<TilesetEditor />}
                  />
                  <Route
                    path="/map/:id"
                    element={<MapEditor />}
                  />
                </Routes>
              </div>
            </CommunityStoreContextProvider>
          </GlobalStoreContextProvider>
        </AuthContextProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
