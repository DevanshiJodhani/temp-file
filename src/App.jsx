import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import Subscription from './Components/Subscription';
import Layout from './Components/LayOut';
import LikedVideos from './Components/LikedVideos';
import History from './Components/History';
import Channel from './Components/Channel';
import PublishVideo from './Components/PublishVideo';
import Settings from './Components/Settings';
import StreamVideo from './Components/StreamVideo';
import EditVideo from './Components/EditVideo';
import SearchVideo from './Components/SearchVideo';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/subscription"
          element={
            <Layout>
              <Subscription />
            </Layout>
          }
        />
        <Route
          path="/likedVideos"
          element={
            <Layout>
              <LikedVideos />
            </Layout>
          }
        />
        <Route
          path="/history"
          element={
            <Layout>
              <History />
            </Layout>
          }
        />
        <Route
          path="/your-videos"
          element={
            <Layout>
              <Channel />
            </Layout>
          }
        />
        <Route
          path="/publish-video"
          element={
            <Layout>
              <PublishVideo />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/watch/:videoId"
          element={
            <Layout>
              <StreamVideo />
            </Layout>
          }
        />
        <Route
          path="/edit/:videoId"
          element={
            <Layout>
              <EditVideo />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchVideo />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
