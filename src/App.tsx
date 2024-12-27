import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Details from "./pages/Details";
import Profile from "./pages/Profile";
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/:mediaType/:id" element={<Details />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
}

export default App;
