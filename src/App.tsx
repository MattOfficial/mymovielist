import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
// import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/common/PrivateRoute";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Details from "./pages/Details";
// import Profile from "./pages/Profile";

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* <Layout> */}
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/:mediaType/:id" element={<Details />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <></>{" "}
                {/* Place holder code. TODO - Remove after proper implementation */}
                {/* <Profile /> */}
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
