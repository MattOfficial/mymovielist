import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../store/slices/authSlice";
import SearchBar from "../features/SearchBar";
import "../../styles/_header.scss";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  window.onscroll = () => {
    setIsScrolled(window.scrollY > 0);
    return () => (window.onscroll = null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            MY MOVIE LIST
          </Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/tv">TV Shows</Link>
          </nav>
        </div>

        <div className="header-center">
          <SearchBar />
        </div>

        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="profile-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
