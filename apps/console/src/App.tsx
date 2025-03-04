import { Outlet, Route, Routes } from "react-router";
import "./App.css";
import { lazy } from "react";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const AuthGuard = lazy(() => import("./components/router/AuthGuard"));
const Layout = lazy(() => import("./components/layout/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const QuizListPage = lazy(() => import("./pages/quiz/QuizListPage"));
const QuizDetailPage = lazy(() => import("./pages/quiz/QuizDetailPage"));
const QuizCreatePage = lazy(() => import("./pages/quiz/QuizCreatePage"));
const QuizStartPage = lazy(() => import("./pages/quiz/QuizStartPage"));

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <AuthGuard>
              <Layout>
                <Outlet />
              </Layout>
            </AuthGuard>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="quiz">
            <Route index element={<QuizListPage />} />
            <Route path=":id" element={<QuizDetailPage />} />
            <Route path="create" element={<QuizCreatePage />} />
            <Route path="start" element={<QuizStartPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
