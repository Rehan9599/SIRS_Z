import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../api";
import "../styles/admin.css";

function AdminWorkers(props) {
	const navigate = useNavigate();
	const [workers, setWorkers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!props.isLogged || !props.isAdmin) {
			navigate("/login", { replace: true });
			return;
		}

		const fetchWorkers = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${API_BASE_URL}/admin/workers`);
				if (response.data.message === "admin_workers_loaded") {
					setWorkers(response.data.workers || []);
				}
			} catch (error) {
				console.error("Error fetching workers:", error);
				setErrorMessage(error.response?.data?.message || "Unable to load workers.");
			} finally {
				setLoading(false);
			}
		};

		fetchWorkers();
	}, [props.isLogged, props.isAdmin, navigate]);

	const getStatusColor = (status) => {
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

	const summaryStats = {
		active: workers.filter((w) => w.status === "Active").length,
		onCall: workers.filter((w) => w.status === "On Call").length,
		inReview: workers.filter((w) => w.status === "On Review").length,
		onLeave: workers.filter((w) => w.status === "On Leave").length
	};

	return (
		<div className="admin-page">
			<Header showAuth={props.isLogged} onLogout={props.onLogout} userName={props.userName} isAdmin={props.isAdmin} />

			<main className="admin-main">
				<section className="admin-hero glass-card">
					<div className="admin-hero__copy">
						<span className="section-kicker">
							<span>Workers</span>
						</span>
						<h1>Worker management</h1>
						<p>View, manage, and assign service requests to qualified team members.</p>
					</div>
				</section>

				<section className="admin-metrics">
					<article className="admin-metric-card glass-card">
						<strong>{workers.length}</strong>
						<span>Total workers</span>
					</article>
					<article className="admin-metric-card glass-card">
						<strong>{summaryStats.active}</strong>
						<span>Active</span>
					</article>
					<article className="admin-metric-card glass-card">
						<strong>{summaryStats.onCall}</strong>
						<span>On call</span>
					</article>
					<article className="admin-metric-card glass-card">
						<strong>{summaryStats.onLeave}</strong>
						<span>On leave</span>
					</article>
				</section>

				<section className="admin-panel glass-card">
					<div className="admin-panel__head">
						<div>
							<h2>Worker roster</h2>
							<p>Roles, status, and active assignments for each team member.</p>
						</div>
						<Link className="action-button action-button--ghost" to="/admin/users">
							<span>Users</span>
						</Link>
					</div>

					{loading && <p style={{ padding: "2rem", textAlign: "center" }}>Loading workers...</p>}

					{errorMessage && (
						<p style={{ padding: "2rem", textAlign: "center", color: "var(--danger-text)" }}>
							{errorMessage}
						</p>
					)}

					{!loading && workers.length === 0 && (
						<p style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
							No workers found yet.
						</p>
					)}

					{!loading && workers.length > 0 && (
						<div className="admin-table-wrap">
							<table className="admin-table admin-table--subpage">
								<thead>
									<tr>
										<th>Name</th>
										<th>Role</th>
										<th>Status</th>
										<th>City</th>
										<th>Availability</th>
										<th>Active Assignments</th>
									</tr>
								</thead>
								<tbody>
									{workers.map((worker) => (
										<tr key={worker.workerID}>
											<td>
												<strong>{worker.userName}</strong>
												<br />
												<small style={{ color: "var(--muted)" }}>{worker.email}</small>
											</td>
											<td>{worker.role}</td>
											<td>
												<span className={`admin-status-pill admin-status-pill--${getStatusColor(worker.status)}`}>
													{worker.status}
												</span>
											</td>
											<td>{worker.city || "N/A"}</td>
											<td>{worker.availability_status || "N/A"}</td>
											<td>{worker.activeAssignments || 0}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default AdminWorkers;
