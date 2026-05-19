import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../api";
import "../styles/admin.css";

function formatDate(value) {
	if (!value) {
		return "N/A";
	}

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return "N/A";
	}

	return parsedDate.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}

function AdminUsers(props) {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [summary, setSummary] = useState({ totalUsers: 0, workerAccounts: 0, onboardedWorkers: 0 });
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	const loadUsers = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_BASE_URL}/admin/users`);
			if (response.data.message === "admin_users_loaded") {
				setUsers(response.data.users || []);
				setSummary(response.data.summary || { totalUsers: 0, workerAccounts: 0, onboardedWorkers: 0 });
				setErrorMessage("");
			}
		} catch (error) {
			console.error("Error fetching admin users:", error);
			setErrorMessage(error.response?.data?.message || "Unable to load users.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!props.isLogged || !props.isAdmin) {
			navigate("/login", { replace: true });
			return;
		}

		loadUsers();
	}, [props.isLogged, props.isAdmin, navigate]);

	const workerUsers = users.filter((user) => Boolean(user.workerID));
	const customerUsers = users.filter((user) => !user.workerID);

	const getWorkerStatusClass = (status) => {
		switch (status?.toLowerCase()) {
			case "active":
				return "success";
			case "on leave":
				return "warning";
			case "on call":
				return "info";
			case "on review":
				return "pending";
			default:
				return "default";
		}
	};

	return (
		<div className="admin-page">
			<Header showAuth={props.isLogged} onLogout={props.onLogout} userName={props.userName} isAdmin={props.isAdmin} />

			<main className="admin-main">
				<section className="admin-hero glass-card">
					<div className="admin-hero__copy">
						<span className="section-kicker">
							<PeopleOutlineOutlinedIcon fontSize="small" />
							<span>Registered accounts</span>
						</span>
						<h1>Review every user account and identify worker-linked profiles.</h1>
						<p>
							This page lists all registered accounts in one place, with worker accounts highlighted so the admin team can review access, profile completion, and operational readiness.
						</p>
					</div>

					<div className="admin-quick-links">
						<button type="button" className="action-button action-button--primary admin-refresh" onClick={loadUsers} disabled={loading}>
							{loading ? "Refreshing..." : "Refresh users"}
						</button>
						<Link className="action-button action-button--ghost" to="/admin/dashboard">
							<DashboardCustomizeOutlinedIcon fontSize="small" />
							<span>Dashboard</span>
						</Link>
						<Link className="action-button action-button--ghost" to="/admin/workers">
							<PersonOutlineOutlinedIcon fontSize="small" />
							<span>Workers</span>
						</Link>
					</div>
				</section>

				<section className="admin-metrics">
					<article className="admin-metric-card glass-card">
						<strong>{summary.totalUsers}</strong>
						<span>Total registered users</span>
					</article>
					<article className="admin-metric-card glass-card">
						<strong>{summary.workerAccounts}</strong>
						<span>Worker accounts</span>
					</article>
					<article className="admin-metric-card glass-card">
						<strong>{summary.onboardedWorkers}</strong>
						<span>Onboarded workers</span>
					</article>
					<article className="admin-metric-card glass-card">
						<strong>{customerUsers.length}</strong>
						<span>Customer accounts</span>
					</article>
				</section>

				{loading && <p className="admin-message">Loading users...</p>}
				{errorMessage && <p className="admin-message admin-message--error">{errorMessage}</p>}

				{!loading && !errorMessage && (
					<>
						<section className="admin-panel glass-card">
							<div className="admin-panel__head">
								<div>
									<h2>All registered users</h2>
									<p>Every account in the system, including worker-linked profiles.</p>
								</div>
							</div>

							{users.length === 0 ? (
								<p className="admin-empty">No registered users found.</p>
							) : (
								<div className="admin-table-wrap">
									<table className="admin-table admin-table--subpage admin-table--users">
										<thead>
											<tr>
												<th>Name</th>
												<th>Email</th>
												<th>Account Type</th>
												<th>City</th>
												<th>Phone</th>
												<th>Joined</th>
											</tr>
										</thead>
										<tbody>
											{users.map((user) => {
												const isWorker = Boolean(user.workerID);
												return (
													<tr key={user.id} className={isWorker ? "admin-user-row admin-user-row--worker" : "admin-user-row"}>
														<td>
															<strong>{user.userName}</strong>
															<br />
															<small style={{ color: "var(--muted)" }}>{isWorker ? "Worker-linked account" : "Customer account"}</small>
														</td>
														<td>{user.email}</td>
														<td>
															<span className={`admin-account-pill admin-account-pill--${isWorker ? "worker" : "customer"}`}>
																{isWorker ? "Worker" : "Customer"}
															</span>
														</td>
														<td>{user.city || "N/A"}</td>
														<td>{user.phone || "N/A"}</td>
														<td>{formatDate(user.created_at)}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							)}
						</section>

						<section className="admin-panel glass-card">
							<div className="admin-panel__head">
								<div>
									<h2>Worker-linked accounts</h2>
									<p>Accounts that have an attached worker profile for service operations.</p>
								</div>
							</div>

							{workerUsers.length === 0 ? (
								<p className="admin-empty">No worker accounts found yet.</p>
							) : (
								<div className="admin-table-wrap">
									<table className="admin-table admin-table--subpage admin-table--users">
										<thead>
											<tr>
												<th>Name</th>
												<th>Worker Role</th>
												<th>Status</th>
												<th>Availability</th>
												<th>Assignments</th>
												<th>Profile State</th>
											</tr>
										</thead>
										<tbody>
											{workerUsers.map((user) => (
												<tr key={user.workerID} className="admin-user-row admin-user-row--worker">
													<td>
														<strong>{user.userName}</strong>
														<br />
														<small style={{ color: "var(--muted)" }}>{user.email}</small>
													</td>
													<td>{user.workerRole || "Service Technician"}</td>
													<td>
														<span className={`admin-status-pill admin-status-pill--${getWorkerStatusClass(user.workerStatus)}`}>
															{user.workerStatus || "Active"}
														</span>
													</td>
													<td>{user.availability_status || "N/A"}</td>
													<td>{user.activeAssignments || 0}</td>
													<td>{user.onboarded ? "Onboarded" : "Pending setup"}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</section>
					</>
				)}
			</main>

			<Footer />
		</div>
	);
}

export default AdminUsers;