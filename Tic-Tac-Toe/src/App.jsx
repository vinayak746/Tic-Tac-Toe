import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import PlayerForm from "./components/PlayerForm";
import Game from "./components/Game";

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
