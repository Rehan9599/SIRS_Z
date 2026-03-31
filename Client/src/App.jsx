import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home/home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";

export default function App() {
	const [isLogged, setIsLogged] = useState(false);
	const [isLoggedId, setIsLoggedId] = useState();
	return (
		<Router>
			<main className="container">
				<Routes>
					<Route path="/" element={<Home isLogged={isLogged} />} />
					<Route path="/login" element={<Login setIsLogged={setIsLogged} setIsLoggedId={setIsLoggedId}  />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/buy" element={<Buy isLogged={isLogged} isLoggedId={isLoggedId}  />} />
					<Route path="/sell" element={<Sell isLogged={isLogged} isLoggedId={isLoggedId} />} />
				</Routes>
			</main>
		</Router>
	);
}
