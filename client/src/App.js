import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {
  WelcomeScreen,
  ProfileScreen,
  ExploreScreen,
  LibraryScreen,
  CommunityScreen,
  TilesetEditor,
  MapEditor,
  ResetPasswordScreen
} from './components'

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="Loading">Loading...</div>}>
        <NavbarBar/>
        <Switch>
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
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
