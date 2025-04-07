import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import PlayerForm from "./components/PlayerForm";
import Game from "./components/Game";
import MultiplayerLobby from "./components/MultiplayerLobby";

function AppWrapper() {
  const location = useLocation();
  const isPlayerForm = location.pathname === "/";

  return (
    <div
      className={
        isPlayerForm
          ? "min-h-screen flex items-center justify-center bg-gray-900 text-white"
          : ""
      }
    >
      <Routes>
        <Route path="/" element={<PlayerForm />} />
        <Route path="/game" element={<Game />} />
        <Route path="/multiplayer" element={<MultiplayerLobby />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
