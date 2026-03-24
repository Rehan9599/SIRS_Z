import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
	const [page, setPage] = useState("login");

	return (
		<main className="container">
			<header className="header">
				<h1>SIRS Z</h1>
				<nav className="nav">
					<button
						className={page === "login" ? "active" : ""}
						onClick={() => setPage("login")}
					>
						Login
					</button>
					<button
						className={page === "signup" ? "active" : ""}
						onClick={() => setPage("signup")}
					>
						Signup
					</button>
				</nav>
			</header>

			<section className="card">{page === "login" ? <Login /> : <Signup />}</section>
		</main>
	);
}
