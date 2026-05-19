import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import API_BASE_URL from "../api";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import "../styles/worker-dashboard.css";

export default function WorkerDashboard(props) {
	const navigate = useNavigate();
	const [worker, setWorker] = useState(null);
	const [assignments, setAssignments] = useState([]);
	const [openRequests, setOpenRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [selectedWorkItem, setSelectedWorkItem] = useState(null);
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [volunteeringRequestId, setVolunteeringRequestId] = useState(null);

	const loadWorkerHome = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_BASE_URL}/worker/home/current/${props.isLoggedId}`);

			if (response.data.message === "worker_home_loaded") {
				setWorker(response.data.worker || null);
				setAssignments(response.data.assignments || []);
				setOpenRequests(response.data.openRequests || []);
				setErrorMessage("");
			}
		} catch (error) {
			console.error("Error loading worker home:", error);
			if (error.response?.status === 404) {
				setErrorMessage("Worker account not found.");
			} else {
				setErrorMessage(error.response?.data?.message || "Unable to load worker home.");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!props.isLogged || !props.isLoggedId) {
			navigate("/login", { replace: true });
			return;
		}

		if (!props.isWorker) {
			navigate("/dashboard", { replace: true });
			return;
		}

		loadWorkerHome();
	}, [props.isLogged, props.isLoggedId, props.isWorker, navigate]);

	const refreshWorkerHome = async () => {
		await loadWorkerHome();
	};

	const handleStatusUpdate = async (assignmentId, newStatus) => {
		try {
			setUpdatingStatus(true);
			const response = await axios.patch(
				`${API_BASE_URL}/worker/assignments/${assignmentId}`,
				{ status: newStatus }
			);

			if (response.data.message === "assignment_updated") {
				setAssignments((prev) =>
					prev.map((a) =>
						a.assignment_id === assignmentId
							? { ...a, status: newStatus }
							: a
					)
				);
				setSelectedWorkItem(null);
				setErrorMessage("");
			}
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "Unable to update status.");
		} finally {
			setUpdatingStatus(false);
		}
	};

	const handleVolunteer = async (requestId) => {
		try {
			setVolunteeringRequestId(requestId);
			const response = await axios.post(`${API_BASE_URL}/worker/volunteer`, {
				userId: props.isLoggedId,
				requestId
			});

			if (response.data.message === "request_volunteered") {
				setErrorMessage("");
				setSelectedWorkItem(null);
				await refreshWorkerHome();
			}
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "Unable to volunteer for this request.");
		} finally {
			setVolunteeringRequestId(null);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "Completed":
				return "success";
			case "In Progress":
				return "warning";
			case "Assigned":
				return "pending";
			case "Cancelled":
				return "danger";
			case "Open":
				return "pending";
			default:
				return "default";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "Completed":
				return <CheckCircleOutlinedIcon fontSize="small" />;
			case "In Progress":
				return <AccessTimeOutlinedIcon fontSize="small" />;
			case "Cancelled":
				return <CancelOutlinedIcon fontSize="small" />;
			default:
				return <AssignmentOutlinedIcon fontSize="small" />;
		}
	};

	const summaryStats = {
		total: assignments.length,
		completed: assignments.filter((a) => a.status === "Completed").length,
		inProgress: assignments.filter((a) => a.status === "In Progress").length,
		pending: assignments.filter((a) => a.status === "Assigned").length,
		openRequests: openRequests.length
	};

	const selectedItem = selectedWorkItem?.item || null;
	const selectedKind = selectedWorkItem?.kind || "";
	const workerTitle = worker?.role || "Worker";
	const selectedKey = selectedKind === "assignment" ? selectedItem?.assignment_id : selectedItem?.request_id;
	const selectedImageUrl = selectedItem?.imageUrl
		? selectedItem.imageUrl.startsWith("http")
			? selectedItem.imageUrl
			: `${API_BASE_URL}${selectedItem.imageUrl}`
		: null;

	return (
		<div className="auth-page">
			<Header showAuth={props.isLogged} userName={props.userName} onLogout={props.onLogout} isAdmin={props.isAdmin} isWorker={props.isWorker} />

			<main className="worker-dashboard-container">
				{/* Header */}
				<section className="worker-header">
					<div className="worker-header__content">
						<div>
							<h1>Worker Portal Home</h1>
							<p className="worker-header__subtitle">
								{workerTitle} {worker?.city ? `• ${worker.city}` : ""} • review open requests and manage your active work.
							</p>
						</div>
						<button
							className="worker-header__logout"
							onClick={props.onLogout}
						>
							Logout
						</button>
					</div>
				</section>

				{/* Summary Cards */}
				<section className="worker-summary">
					<div className="worker-summary-card worker-summary-card--pending">
						<div className="worker-summary-card__number">{summaryStats.openRequests}</div>
						<div className="worker-summary-card__label">Open requests</div>
					</div>
					<div className="worker-summary-card">
						<div className="worker-summary-card__number">{summaryStats.total}</div>
						<div className="worker-summary-card__label">Total Assignments</div>
					</div>
					<div className="worker-summary-card worker-summary-card--completed">
						<div className="worker-summary-card__number">{summaryStats.completed}</div>
						<div className="worker-summary-card__label">Completed</div>
					</div>
					<div className="worker-summary-card worker-summary-card--progress">
						<div className="worker-summary-card__number">{summaryStats.inProgress}</div>
						<div className="worker-summary-card__label">In Progress</div>
					</div>
					<div className="worker-summary-card worker-summary-card--pending">
						<div className="worker-summary-card__number">{summaryStats.pending}</div>
						<div className="worker-summary-card__label">Pending</div>
					</div>
				</section>

				{/* Main Content */}
				<section className="worker-content">
					<div className="worker-main-column">
						<div className="worker-open-requests" id="open-requests">
							<div className="worker-section-head">
								<div>
									<h2>Open requests</h2>
									<p>Volunteer for new service requests before they are assigned elsewhere.</p>
								</div>
								<span className="worker-section-pill">{summaryStats.openRequests} available</span>
							</div>

							{loading && (
								<div className="worker-loading">
									<p>Loading open requests...</p>
								</div>
							)}

							{!loading && openRequests.length === 0 && (
								<div className="worker-empty">
									<AssignmentOutlinedIcon />
									<h3>No open requests right now</h3>
									<p>New requests will appear here when customers submit work.</p>
								</div>
							)}

							{!loading && openRequests.length > 0 && (
								<div className="worker-open-request-list">
									{openRequests.map((request) => (
										<article
											key={request.request_id}
											className={`worker-assignment-card worker-open-request-card ${selectedKey === request.request_id && selectedKind === "open-request" ? "active" : ""}`}
											onClick={() => setSelectedWorkItem({ kind: "open-request", item: request })}
										>
											<div className="worker-assignment-card__header">
												<div>
													<h3>{request.title}</h3>
													<p className="worker-assignment-card__customer">
														{request.userName || "Customer"} • {request.city || worker?.city || "Location"}
													</p>
												</div>
												<span className={`worker-status-badge worker-status-badge--${getStatusColor(request.status || "Open")}`}>
													{getStatusIcon(request.status || "Open")}
													{request.status || "Open"}
												</span>
											</div>

											<div className="worker-assignment-card__details">
												<div>
													<strong>Type:</strong> {request.request_type}
												</div>
												<div>
													<strong>Equipment:</strong> {request.equipment_category || "N/A"}
												</div>
												{request.urgency && (
													<div>
														<strong>Urgency:</strong> {request.urgency}
													</div>
												)}
											</div>

											{request.notes ? <p className="worker-open-request-card__notes">{request.notes}</p> : null}

											<div className="worker-open-request-card__actions">
												<button
													type="button"
													className="action-button action-button--ghost"
													onClick={(event) => {
														event.stopPropagation();
														setSelectedWorkItem({ kind: "open-request", item: request });
													}}
												>
													Preview
												</button>
												<button
													type="button"
													className="action-button action-button--primary"
													onClick={(event) => {
														event.stopPropagation();
														handleVolunteer(request.request_id);
													}}
													disabled={volunteeringRequestId === request.request_id}
												>
													{volunteeringRequestId === request.request_id ? "Volunteering..." : "Volunteer"}
												</button>
											</div>
										</article>
									))}
								</div>
							)}
						</div>

						<div className="worker-assignments" id="my-work">
							<h2>Your work queue</h2>

							{errorMessage && (
							<div className="worker-error">
								<p>{errorMessage}</p>
							</div>
						)}

							{loading && (
								<div className="worker-loading">
									<p>Loading your work queue...</p>
								</div>
							)}

							{!loading && assignments.length === 0 && (
							<div className="worker-empty">
								<AssignmentOutlinedIcon />
								<h3>No assignments yet</h3>
									<p>Open requests will appear above and here once you volunteer or are assigned.</p>
							</div>
						)}

							{!loading && assignments.length > 0 && (
							<div className="worker-assignments-list">
								{assignments.map((assignment) => (
									<div
										key={assignment.assignment_id}
										className={`worker-assignment-card ${
												selectedKind === "assignment" && selectedItem?.assignment_id === assignment.assignment_id
												? "active"
												: ""
										}`}
											onClick={() => setSelectedWorkItem({ kind: "assignment", item: assignment })}
									>
										<div className="worker-assignment-card__header">
											<div>
												<h3>{assignment.title}</h3>
												<p className="worker-assignment-card__customer">
													{assignment.userName || "Customer"} • {assignment.city || "Location"}
												</p>
											</div>
											<span
												className={`worker-status-badge worker-status-badge--${getStatusColor(
													assignment.status
												)}`}
											>
												{getStatusIcon(assignment.status)}
												{assignment.status}
											</span>
										</div>

										<div className="worker-assignment-card__details">
											<div>
												<strong>Type:</strong> {assignment.request_type}
											</div>
											<div>
												<strong>Equipment:</strong> {assignment.equipment_category || "N/A"}
											</div>
											{assignment.urgency && (
												<div>
													<strong>Urgency:</strong> {assignment.urgency}
												</div>
											)}
										</div>

										<div className="worker-assignment-card__footer">
											<small>
												Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
											</small>
										</div>
									</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Assignment Details Panel */}
					{selectedWorkItem && (
						<div className="worker-assignment-details">
							<div className="worker-assignment-details__header">
								<h3>{selectedItem?.title}</h3>
								<button
									className="worker-assignment-details__close"
									onClick={() => setSelectedWorkItem(null)}
								>
									✕
								</button>
							</div>

							<div className="worker-assignment-details__content">
								<section>
									<h4>Customer Information</h4>
									<div className="worker-detail-row">
										<span>Name:</span>
										<strong>{selectedItem?.userName || "Customer"}</strong>
									</div>
									<div className="worker-detail-row">
										<span>Email:</span>
										<strong>{selectedItem?.email || "Not shared"}</strong>
									</div>
									<div className="worker-detail-row">
										<span>Location:</span>
										<strong>{selectedItem?.city || "Not specified"}</strong>
									</div>
								</section>

								<section>
									<h4>{selectedKind === "assignment" ? "Request Details" : "Open request details"}</h4>
									<div className="worker-detail-row">
										<span>Type:</span>
										<strong>{selectedItem?.request_type}</strong>
									</div>
									<div className="worker-detail-row">
										<span>Equipment:</span>
										<strong>{selectedItem?.equipment_category || "N/A"}</strong>
									</div>
									{selectedItem?.brand && (
										<div className="worker-detail-row">
											<span>Brand:</span>
											<strong>{selectedItem.brand}</strong>
										</div>
									)}
									{selectedItem?.model && (
										<div className="worker-detail-row">
											<span>Model:</span>
											<strong>{selectedItem.model}</strong>
										</div>
									)}
									{selectedItem?.urgency && (
										<div className="worker-detail-row">
											<span>Urgency:</span>
											<strong>{selectedItem.urgency}</strong>
										</div>
									)}
									{selectedItem?.requestNotes && (
										<div className="worker-detail-section">
											<span>Notes:</span>
											<p>{selectedItem.requestNotes}</p>
										</div>
									)}
									{selectedItem?.notes && selectedKind === "open-request" && (
										<div className="worker-detail-section">
											<span>Notes:</span>
											<p>{selectedItem.notes}</p>
										</div>
									)}
								</section>

								{selectedItem?.imageUrl && (
									<section>
										<h4>Equipment Image</h4>
										<img
											src={selectedImageUrl}
											alt="Equipment"
											className="worker-assignment-image"
										/>
									</section>
								)}

								{selectedKind === "assignment" ? (
									<section>
										<h4>Assignment Status</h4>
										<div className="worker-status-options">
											{["Assigned", "In Progress", "Completed", "Cancelled"].map((status) => (
												<button
													key={status}
													className={`worker-status-btn ${selectedItem.status === status ? "active" : ""}`}
													onClick={() => handleStatusUpdate(selectedItem.assignment_id, status)}
													disabled={updatingStatus}
												>
													{status}
												</button>
											))}
										</div>
									</section>
								) : (
									<section>
										<h4>Take this work</h4>
										<p className="worker-detail-section__note">
											Volunteering will assign this request to your worker profile and remove it from the open pool.
										</p>
										<button
											type="button"
											className="action-button action-button--primary"
											onClick={() => handleVolunteer(selectedItem.request_id)}
											disabled={volunteeringRequestId === selectedItem.request_id}
										>
											{volunteeringRequestId === selectedItem.request_id ? "Volunteering..." : "Volunteer for this work"}
										</button>
									</section>
								)}
							</div>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
