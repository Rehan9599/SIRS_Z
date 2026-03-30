
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <div className="logo">
        <h1>ReadyCool</h1>
      </div>
      <nav className="nav">
        {props.page=='home' && <a href="/">Home</a>}
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        {props.showAuthButtons && (
          <>
            <Link to="/signup"><button>Sign Up</button></Link>
            <Link to="/login"><button>Login</button></Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
