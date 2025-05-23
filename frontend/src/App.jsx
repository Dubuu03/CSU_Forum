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
import UnderDevelopment from "./pages/UnderDevelopment";
import DiscussionDetailPage from "./pages/DiscussionDetailPage";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* General routes */}
        <Route path="/" element={<Onboarding />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/discussion" element={<CreateDiscussion />} />        {/* Discussions */}
        <Route
          path="/discussions/:discussionId"
          element={<DiscussionDetailPage />}
        />

        {/* Communities */}
        <Route path="/communities" element={<Communities />} />
        <Route path="/createcommunity" element={<CreateCommunity />} />
        <Route path="/community" element={<Community />} />

        {/* under development routes */}
        <Route path="/communities/csu-carig" element={<UnderDevelopment />} />
        <Route path="/communities/cics" element={<UnderDevelopment />} />

        {/* Dynamic CommunityPage for all other community IDs */}
        <Route path="/communities/:communityId" element={<CommunityPage />} />

        {/* Optional fallback for unmatched routes */}
        <Route path="/under-development" element={<UnderDevelopment />} />
        <Route path="*" element={<UnderDevelopment />} />
      </Routes>
    </Router>
  );
};

export default App;
