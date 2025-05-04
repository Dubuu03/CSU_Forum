import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateCommunity from "./pages/CreateCommunity";
import Community from "./pages/Community";
import Onboarding from "./pages/Onboarding";
import Communities from "./pages/Communities";
import Home from "./pages/Home";
import CommunityPage from "./pages/CommunityPage";
import CreateDiscussion from "./pages/CreateDiscussion";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/community" element={<Community />} />
        <Route path="/createcommunity" element={<CreateCommunity />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/community-page" element={<CommunityPage />} />
        <Route path="/discussion" element={<CreateDiscussion />}></Route>
      </Routes>
    </Router>
  );
};

export default App;