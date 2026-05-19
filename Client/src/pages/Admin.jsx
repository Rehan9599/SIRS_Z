import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../api";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import "../styles/admin.css";

function Admin(props) {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [accountSummary, setAccountSummary] = useState({ totalUsers: 0, workerAccounts: 0, onboardedWorkers: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentWorkers, setRecentWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [dashboardResponse, usersResponse, workersResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/dashboard`),
        fetch(`${API_BASE_URL}/admin/users`),
        fetch(`${API_BASE_URL}/admin/workers`)
      ]);

      const dashboardData = await dashboardResponse.json();
      const usersData = await usersResponse.json();
      const workersData = await workersResponse.json();

      if (!dashboardResponse.ok) {
        throw new Error(dashboardData.message || "Unable to load admin dashboard.");
      }

      if (!usersResponse.ok) {
        throw new Error(usersData.message || "Unable to load admin users.");
      }

      if (!workersResponse.ok) {
        throw new Error(workersData.message || "Unable to load admin workers.");
      }

      setDashboard(dashboardData);
      setAccountSummary(usersData.summary || { totalUsers: 0, workerAccounts: 0, onboardedWorkers: 0 });
      setRecentUsers((usersData.users || []).slice(0, 4));
      setRecentWorkers((workersData.workers || []).slice(0, 4));
    } catch (error) {
      setErrorMessage(error.message || "Unable to load admin dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!props.isLogged || !props.isAdmin) {
      navigate("/login", { replace: true });
      return;
    }

    loadDashboard();
  }, [props.isLogged, props.isAdmin, navigate]);

  const recentListings = dashboard?.recentListings || [];
  const recentPurchases = dashboard?.recentPurchases || [];
  const serviceVisits = dashboard?.serviceVisits || [];
  const amcTenderRequests = dashboard?.amcTenderRequests || [];
  const serviceRequests = dashboard?.serviceRequests || [];

  const formatMoney = (value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return `Rs ${value}`;
    }

    return `Rs ${numericValue.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  };

  const formatDate = (value) => {
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
  };

  return (
    <div className="admin-page">
      <Header showAuth={props.isLogged} onLogout={props.onLogout} userName={props.userName} isAdmin={props.isAdmin} />

      <main className="admin-main">
        <section className="admin-hero glass-card">
          <div className="admin-hero__copy">
            <span className="section-kicker">
              <DashboardCustomizeOutlinedIcon fontSize="small" />
              <span>Admin command center</span>
            </span>
            <h1>Track buy, sell, service, AMC, and tender activity in one dashboard.</h1>
            <p>
              This view gives you the operating picture for ReadyCool: recent transactions, open service demand, and contract-style requests.
            </p>
          </div>

          <button type="button" className="action-button action-button--primary admin-refresh" onClick={loadDashboard} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh dashboard"}
          </button>
          <div className="admin-quick-links">
            <Link className="action-button action-button--ghost" to="/admin/users">
              <PeopleOutlineOutlinedIcon fontSize="small" />
              <span>Users</span>
            </Link>
            <Link className="action-button action-button--ghost" to="/admin/workers">
              <span>Workers</span>
            </Link>
            <Link className="action-button action-button--ghost" to="/admin/revenue">
              <span>Revenue</span>
            </Link>
          </div>
        </section>

        <section className="admin-summary-grid">
          <article className="admin-summary-card glass-card">
            <span>Registered users</span>
            <strong>{accountSummary.totalUsers}</strong>
            <small>All customer and worker accounts</small>
          </article>
          <article className="admin-summary-card glass-card">
            <span>Worker accounts</span>
            <strong>{accountSummary.workerAccounts}</strong>
            <small>Accounts linked to field operations</small>
          </article>
          <article className="admin-summary-card glass-card">
            <span>Onboarded workers</span>
            <strong>{accountSummary.onboardedWorkers}</strong>
            <small>Workers ready for assignments</small>
          </article>
          <article className="admin-summary-card glass-card">
            <span>Open service demand</span>
            <strong>{serviceVisits.length + amcTenderRequests.length}</strong>
            <small>Requests waiting for action</small>
          </article>
        </section>

        <section className="admin-metrics">
          <article className="admin-metric-card glass-card">
            <Inventory2OutlinedIcon />
            <strong>{dashboard?.summary?.listingCount ?? 0}</strong>
            <span>Recent listings</span>
          </article>
          <article className="admin-metric-card glass-card">
            <ShoppingBagOutlinedIcon />
            <strong>{dashboard?.summary?.purchaseCount ?? 0}</strong>
            <span>Recent purchases</span>
          </article>
          <article className="admin-metric-card glass-card">
            <BuildOutlinedIcon />
            <strong>{dashboard?.summary?.serviceVisitCount ?? 0}</strong>
            <span>Service visits</span>
          </article>
          <article className="admin-metric-card glass-card">
            <HandshakeOutlinedIcon />
            <strong>{dashboard?.summary?.amcTenderCount ?? 0}</strong>
            <span>AMC / tender requests</span>
          </article>
        </section>

        {isLoading && <p className="admin-message">Loading dashboard...</p>}
        {errorMessage && <p className="admin-message admin-message--error">{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <>
            <section className="admin-grid-2">
              <article className="admin-panel glass-card">
                <div className="admin-panel__head">
                  <div>
                    <h2>Recent buy / sell activity</h2>
                    <p>Latest listings posted and the newest purchase records.</p>
                  </div>
                  <StorefrontOutlinedIcon />
                </div>

                <div className="admin-subgrid">
                  <div className="admin-subpanel">
                    <h3>Latest listings</h3>
                    {recentListings.length === 0 ? (
                      <p className="admin-empty">No listings available.</p>
                    ) : (
                      <ul className="admin-list">
                        {recentListings.map((listing) => (
                          <li key={listing.id}>
                            <div>
                              <strong>{listing.item_name}</strong>
                              <span>{listing.userName || "Unknown seller"}</span>
                            </div>
                            <div className="admin-meta">
                                <span>{formatMoney(listing.price)}</span>
                              <span>{listing.verificationStatus || "Pending Review"}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="admin-subpanel">
                    <h3>Latest purchases</h3>
                    {recentPurchases.length === 0 ? (
                      <p className="admin-empty">No purchase records yet.</p>
                    ) : (
                      <ul className="admin-list">
                        {recentPurchases.map((purchase) => (
                          <li key={purchase.id}>
                            <div>
                              <strong>{purchase.item_name}</strong>
                              <span>{purchase.userName || "Unknown buyer"}</span>
                            </div>
                            <div className="admin-meta">
                                <span>{formatMoney(purchase.price)}</span>
                              <span>{purchase.status || "Recorded"}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>

              <article className="admin-panel glass-card">
                <div className="admin-panel__head">
                  <div>
                    <h2>Service requests</h2>
                    <p>All incoming service bookings from the website.</p>
                  </div>
                  <BuildOutlinedIcon />
                </div>

                {serviceVisits.length === 0 ? (
                  <p className="admin-empty">No service visit requests yet.</p>
                ) : (
                  <ul className="admin-list admin-list--stacked">
                    {serviceVisits.map((request) => (
                      <li key={request.id}>
                        <div>
                          <strong>{request.title || request.request_type || "Service request"}</strong>
                          <span>{request.userName || "Unknown user"} · {request.city || "-"}</span>
                          {request.notes ? <p className="admin-notes">{request.notes}</p> : null}
                        </div>
                        <div className="admin-meta">
                          <span>{request.request_type || "Service Visit"}</span>
                          <span>{request.urgency || "Medium"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </section>

            <section className="admin-grid-2">
              <article className="admin-panel glass-card">
                <div className="admin-panel__head">
                  <div>
                    <h2>AMC / tender requests</h2>
                    <p>Contract-style bookings that need follow-up and planning.</p>
                  </div>
                  <HandshakeOutlinedIcon />
                </div>

                {amcTenderRequests.length === 0 ? (
                  <p className="admin-empty">No AMC or tender requests yet.</p>
                ) : (
                  <ul className="admin-list admin-list--stacked">
                    {amcTenderRequests.map((request) => (
                      <li key={request.id}>
                        <div>
                          <strong>{request.title || request.request_type || "Contract request"}</strong>
                          <span>{request.request_type} · {request.userName || "Unknown user"}</span>
                          {request.notes ? <p className="admin-notes">{request.notes}</p> : null}
                        </div>
                        <div className="admin-meta">
                          <span>{request.city || "-"}</span>
                          <span>{request.status || "Open"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <article className="admin-panel glass-card">
                <div className="admin-panel__head">
                  <div>
                    <h2>Request mix</h2>
                    <p>Quick snapshot of all service request categories on the site.</p>
                  </div>
                  <Inventory2OutlinedIcon />
                </div>

                {serviceRequests.length === 0 ? (
                  <p className="admin-empty">No requests yet.</p>
                ) : (
                  <div className="admin-category-grid">
                    <div className="admin-category-card">
                      <strong>{dashboard?.summary?.serviceRequestCount ?? 0}</strong>
                      <span>Total service requests</span>
                    </div>
                    <div className="admin-category-card">
                      <strong>{serviceVisits.length}</strong>
                      <span>Service visits</span>
                    </div>
                    <div className="admin-category-card">
                      <strong>{amcTenderRequests.length}</strong>
                      <span>AMC / tender</span>
                    </div>
                  </div>
                )}
              </article>
            </section>

            <section className="admin-grid-2">
              <article className="admin-panel glass-card">
                <div className="admin-panel__head">
                  <div>
                    <h2>Latest registered accounts</h2>
                    <p>New customer and worker accounts at a glance.</p>
                  </div>
                </div>

                {recentUsers.length === 0 ? (
                  <p className="admin-empty">No account activity yet.</p>
                ) : (
                  <ul className="admin-list admin-list--stacked">
                    {recentUsers.map((user) => (
                      <li key={user.id}>
                        <div>
                          <strong>{user.userName}</strong>
                          <span>{user.email}</span>
                          <p className="admin-notes">Joined {formatDate(user.created_at)} · {user.workerID ? "Worker-linked account" : "Customer account"}</p>
                        </div>
                        <div className="admin-meta">
                          <span>{user.city || "N/A"}</span>
                          <span>{user.phone || "N/A"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <article className="admin-panel glass-card">
                <div className="admin-panel__head">
                  <div>
                    <h2>Latest workers</h2>
                    <p>Most recent worker records with current status.</p>
                  </div>
                </div>

                {recentWorkers.length === 0 ? (
                  <p className="admin-empty">No workers found yet.</p>
                ) : (
                  <ul className="admin-list admin-list--stacked">
                    {recentWorkers.map((worker) => (
                      <li key={worker.workerID}>
                        <div>
                          <strong>{worker.userName}</strong>
                          <span>{worker.email}</span>
                          <p className="admin-notes">{worker.role} · {worker.city || "N/A"}</p>
                        </div>
                        <div className="admin-meta">
                          <span>{worker.status || "Active"}</span>
                          <span>{worker.activeAssignments || 0} active</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Admin;
