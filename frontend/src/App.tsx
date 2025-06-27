import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./pages/Register";

function AppContext() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="/register" element={<Register />} />

        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContext />
    </AuthProvider>
  );
}

export default App;
