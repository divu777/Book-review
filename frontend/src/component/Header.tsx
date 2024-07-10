import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <NavLink to="/">On.Book</NavLink>
        </div>
        <nav className="flex space-x-6 text-lg font-medium">
          <NavLink to="/" className="nav-link">
            Books
          </NavLink>
          <NavLink to="/" className="nav-link">
            Categories
          </NavLink>
          <NavLink to="/" className="nav-link">
            Wishlist
          </NavLink>
          <NavLink to="/" className="nav-link">
            Blog
          </NavLink>
          <NavLink to="/" className="nav-link">
            About Us
          </NavLink>
        </nav>
        <div className="flex space-x-6 text-lg font-medium">
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="nav-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-link">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
