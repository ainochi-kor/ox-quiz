import { Outlet, Route, Routes } from "react-router";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import AuthGuard from "./components/router/AuthGuard";
import HomePage from "./pages/HomePage";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <AuthGuard>
              <Layout>
                <Outlet />
              </Layout>
            </AuthGuard>
          }
        >
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
