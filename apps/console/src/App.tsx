import { Route, Routes } from "react-router";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import AuthGuard from "./components/router/AuthGuard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<h1>nothing</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
