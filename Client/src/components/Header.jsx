
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <div className="logo">
        <h1>ReadyCool</h1>
      </div>
      <nav className="nav">
        {(props.page!='login'||props.page!='signup') && <Link to="/">Home</Link>}
        {props.showAuth? (
          (props.page!='login'&&props.page!='signup') && 
          <>
          <Link to="/buy">Buy</Link>
          <Link to="/sell">Sell</Link>
          </>
         ): " "}
        {props.showAuth? (
          <>
            <Link to="/login"><button>Logout</button></Link>
          </>
        ): (
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
