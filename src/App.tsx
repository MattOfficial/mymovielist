import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Details from "./pages/Details";
import Profile from "./pages/Profile";
import Header from "./components/layout/Header";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
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
        {/* </Layout> */}
      </Router>
    </Provider>
  );
}

export default App;
