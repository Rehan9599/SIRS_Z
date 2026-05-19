import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home/home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Commercial from "./pages/Commercial";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminWorkers from "./pages/AdminWorkers";
import AdminRevenue from "./pages/AdminRevenue";
import WorkerOnboarding from "./pages/WorkerOnboarding";
import WorkerDashboard from "./pages/WorkerDashboard";

const AUTH_STORAGE_KEY = "readycool-auth";

function readStoredAuth() {
	if (typeof window === "undefined") {
		return { isLogged: false, isLoggedId: null, userName: "", isAdmin: false, isWorker: false };
	}

	try {
		const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
		if (!rawValue) {
			return { isLogged: false, isLoggedId: null, userName: "", isAdmin: false, isWorker: false };
		}

		const parsedValue = JSON.parse(rawValue);
		return {
			isLogged: Boolean(parsedValue.isLogged),
			isLoggedId: parsedValue.isLoggedId ?? null,
			userName: parsedValue.userName || "",
			isAdmin: Boolean(parsedValue.isAdmin),
			isWorker: Boolean(parsedValue.isWorker)
		};
	} catch {
		return { isLogged: false, isLoggedId: null, userName: "", isAdmin: false, isWorker: false };
	}
}

export default function App() {
	const [isLogged, setIsLogged] = useState(false);
	const [isLoggedId, setIsLoggedId] = useState(null);
	const [userName, setUserName] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [isWorker, setIsWorker] = useState(false);

	useEffect(() => {
		const storedAuth = readStoredAuth();
		setIsLogged(storedAuth.isLogged);
		setIsLoggedId(storedAuth.isLoggedId);
		setUserName(storedAuth.userName);
		setIsAdmin(storedAuth.isAdmin);
		setIsWorker(storedAuth.isWorker);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		if (isLogged) {
			window.localStorage.setItem(
				AUTH_STORAGE_KEY,
				JSON.stringify({ isLogged, isLoggedId, userName, isAdmin, isWorker })
			);
		} else {
			window.localStorage.removeItem(AUTH_STORAGE_KEY);
		}
	}, [isLogged, isLoggedId, userName, isAdmin, isWorker]);

	const handleLogout = () => {
		setIsLogged(false);
		setIsLoggedId(null);
		setUserName("");
		setIsAdmin(false);
		setIsWorker(false);
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(AUTH_STORAGE_KEY);
		}
	};

	const sharedProps = {
		isLogged,
		isLoggedId,
		isAdmin,
		isWorker,
		onLogout: handleLogout,
		userName,
		setIsAdmin,
		setIsWorker
	};

	const adminDashboardElement = <Admin {...sharedProps} />;
	const userDashboardElement = isAdmin ? <Navigate to="/admin/dashboard" replace /> : isWorker ? <Navigate to="/worker/dashboard" replace /> : <Dashboard {...sharedProps} />;
	const workerOnboardingElement = <WorkerOnboarding {...sharedProps} />;
	const workerDashboardElement = <WorkerDashboard {...sharedProps} />;

	return (
		<Router>
			<main className="container">
				<Routes>
					<Route path="/" element={<Home {...sharedProps} />} />
					<Route path="/login" element={<Login setIsLogged={setIsLogged} setIsLoggedId={setIsLoggedId} setUserName={setUserName} setIsAdmin={setIsAdmin} setIsWorker={setIsWorker} onLogout={handleLogout} />} />
					<Route path="/signup" element={<Signup onLogout={handleLogout} />} />
					<Route path="/buy" element={<Buy {...sharedProps} />} />
					<Route path="/sell" element={<Sell {...sharedProps} />} />
					<Route path="/commercial" element={<Commercial {...sharedProps} />} />
					<Route path="/dashboard" element={userDashboardElement} />
					<Route path="/profile" element={<Profile {...sharedProps} onUpdateUserName={setUserName} />} />
					<Route path="/worker/onboard" element={workerOnboardingElement} />
					<Route path="/worker/dashboard" element={workerDashboardElement} />
					<Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
					<Route path="/admin/dashboard" element={adminDashboardElement} />
					<Route path="/admin/users" element={<AdminUsers {...sharedProps} />} />
					<Route path="/admin/workers" element={<AdminWorkers {...sharedProps} />} />
					<Route path="/admin/revenue" element={<AdminRevenue {...sharedProps} />} />
				</Routes>
			</main>
		</Router>
	);
}
