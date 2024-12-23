// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { login, register } from "../store/slices/authSlice";
import "../styles/_login.scss";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(
          login({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();
      } else {
        await dispatch(
          register({
            email: formData.email,
            password: formData.password,
            username: formData.username,
          })
        ).unwrap();
      }
      navigate("/");
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <img
          src="/netflix-background.jpg"
          alt="background"
          className="auth-background-image"
        />
        <div className="auth-background-overlay"></div>
      </div>

      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>

          {error && <div className="error-message">{error}</div>}

          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                className="auth-input"
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>

          <div className="auth-switch">
            {isLogin ? (
              <>
                <p>New to Netflix?</p>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="switch-button"
                >
                  Sign up now
                </button>
              </>
            ) : (
              <>
                <p>Already have an account?</p>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="switch-button"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
