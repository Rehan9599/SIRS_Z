import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const THEME_STORAGE_KEY = "readycool-mode";

function Header(props) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") {
      return "default";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) || "default";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.mode = mode;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  }, [mode]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleMode = () => {
    setMode((previousMode) => (previousMode === "default" ? "chill" : "default"));
  };

  const handleLogout = () => {
    if (props.onLogout) {
      props.onLogout();
    }

    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">
            <AcUnitOutlinedIcon fontSize="small" />
          </span>
          <span className="brand__text">
            <strong>ReadyCool</strong>
            <span>service, resale, tenders</span>
          </span>
        </Link>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <CloseRoundedIcon fontSize="small" /> : <MenuRoundedIcon fontSize="small" />}
        </button>

        <nav className="site-nav">
          <Link to="/" className="nav-link">
            <HomeOutlinedIcon fontSize="small" />
            <span>Home</span>
          </Link>
          <Link to="/commercial" className="nav-link nav-link--primary">
            <StorefrontOutlinedIcon fontSize="small" />
            <span>Commercial</span>
          </Link>
          {props.showAuth ? (
            <>
              <Link to="/buy" className="nav-link">
                <Inventory2OutlinedIcon fontSize="small" />
                <span>Buy</span>
              </Link>
              <Link to="/sell" className="nav-link">
                <SellOutlinedIcon fontSize="small" />
                <span>Sell</span>
              </Link>

              <div className="profile-menu" ref={menuRef}>
                <button
                  type="button"
                  className="nav-link nav-button profile-menu__trigger"
                  onClick={() => setMenuOpen((previous) => !previous)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  <span>{props.userName || "Profile"}</span>
                  <KeyboardArrowDownRoundedIcon fontSize="small" />
                </button>

                {menuOpen && (
                  <div className="profile-menu__panel" role="menu">
                    <Link to="/profile" className="profile-menu__item" onClick={() => setMenuOpen(false)}>
                      <PersonOutlineOutlinedIcon fontSize="small" />
                      <span>View / Edit Profile</span>
                    </Link>
                    <Link to="/dashboard" className="profile-menu__item" onClick={() => setMenuOpen(false)}>
                      <DashboardCustomizeOutlinedIcon fontSize="small" />
                      <span>Dashboard</span>
                    </Link>
                    <button type="button" className="profile-menu__item" onClick={toggleMode}>
                      {mode === "default" ? <DarkModeOutlinedIcon fontSize="small" /> : <WbSunnyOutlinedIcon fontSize="small" />}
                      <span>{mode === "default" ? "Enable Chill Mode" : "Switch to Light Mode"}</span>
                    </button>
                    <button type="button" className="profile-menu__item profile-menu__item--danger" onClick={handleLogout}>
                      <LogoutOutlinedIcon fontSize="small" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button type="button" className="nav-link nav-button" onClick={toggleMode}>
                {mode === "default" ? <DarkModeOutlinedIcon fontSize="small" /> : <WbSunnyOutlinedIcon fontSize="small" />}
                <span>{mode === "default" ? "Chill" : "Light"}</span>
              </button>
              <Link to="/signup" className="nav-link nav-button">
                <PersonAddAltOutlinedIcon fontSize="small" />
                <span>Sign Up</span>
              </Link>
              <Link to="/login" className="nav-link nav-button">
                <LoginOutlinedIcon fontSize="small" />
                <span>Login</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" role="dialog" aria-modal="true" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-nav__head">
              <span className="mobile-nav__brand">ReadyCool</span>
              <button
                type="button"
                className="mobile-nav__close"
                aria-label="Close navigation"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CloseRoundedIcon fontSize="small" />
              </button>
            </div>

            <div className="mobile-nav__section">
              <button type="button" className="mobile-nav-item" onClick={toggleMode}>
                {mode === "default" ? <DarkModeOutlinedIcon fontSize="small" /> : <WbSunnyOutlinedIcon fontSize="small" />}
                <span>{mode === "default" ? "Enable Chill Mode" : "Switch to Light Mode"}</span>
              </button>
            </div>

            <div className="mobile-nav__section">
              <Link to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <HomeOutlinedIcon fontSize="small" />
                <span>Home</span>
              </Link>
              <Link to="/commercial" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <StorefrontOutlinedIcon fontSize="small" />
                <span>Commercial</span>
              </Link>
              {props.showAuth && (
                <>
                  <Link to="/buy" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <Inventory2OutlinedIcon fontSize="small" />
                    <span>Buy</span>
                  </Link>
                  <Link to="/sell" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <SellOutlinedIcon fontSize="small" />
                    <span>Sell</span>
                  </Link>
                  <Link to="/dashboard" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <DashboardCustomizeOutlinedIcon fontSize="small" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    <span>Profile</span>
                  </Link>
                </>
              )}
            </div>

            <div className="mobile-nav__section mobile-nav__section--footer">
              {props.showAuth ? (
                <button
                  type="button"
                  className="mobile-nav-item mobile-nav-item--danger"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogoutOutlinedIcon fontSize="small" />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link to="/signup" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <PersonAddAltOutlinedIcon fontSize="small" />
                    <span>Sign Up</span>
                  </Link>
                  <Link to="/login" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <LoginOutlinedIcon fontSize="small" />
                    <span>Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
