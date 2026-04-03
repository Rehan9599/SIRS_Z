import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../api";
import "../styles/dashboard.css";

function Dashboard(props) {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!props.isLogged || !props.isLoggedId) {
      navigate("/login", { replace: true });
      return;
    }

    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/${props.isLoggedId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load dashboard right now.");
        }
        setDashboard(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [props.isLogged, props.isLoggedId, navigate]);

  const listings = dashboard?.listings || [];
  const requests = dashboard?.requests || [];
  const inquiriesSent = dashboard?.inquiriesSent || [];
  const inquiriesReceived = dashboard?.inquiriesReceived || [];
  const purchases = dashboard?.purchases || [];

  return (
    <div className="dashboard-page">
      <Header
        showAuth={props.isLogged}
        onLogout={props.onLogout}
        userName={props.userName}
      />

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div className="dashboard-hero__copy">
            <span className="section-kicker">
              <DashboardCustomizeOutlinedIcon fontSize="small" />
              <span>Your dashboard</span>
            </span>
            <h1>Track listings, requests, and purchases in one place.</h1>
            <p>
              Use this panel to manage activity across ReadyCool including your posted listings,
              service requests, and bought items.
            </p>
            <div className="dashboard-actions">
              <Link className="action-button action-button--primary" to="/sell">
                <Inventory2OutlinedIcon fontSize="small" />
                <span>Create listing</span>
              </Link>
              <Link className="action-button action-button--ghost" to="/buy">
                <ArrowForwardRoundedIcon fontSize="small" />
                <span>Browse inventory</span>
              </Link>
            </div>
          </div>

          <div className="dashboard-hero__stats">
            <article className="dashboard-stat-card">
              <Inventory2OutlinedIcon />
              <strong>{dashboard?.summary?.listingCount ?? 0}</strong>
              <span>Listings posted</span>
            </article>
            <article className="dashboard-stat-card">
              <BuildOutlinedIcon />
              <strong>{dashboard?.summary?.requestCount ?? 0}</strong>
              <span>Service requests</span>
            </article>
            <article className="dashboard-stat-card">
              <ShoppingBagOutlinedIcon />
              <strong>{dashboard?.summary?.purchaseCount ?? 0}</strong>
              <span>Items purchased</span>
            </article>
          </div>
        </section>

        {isLoading && <p className="dashboard-message">Loading dashboard...</p>}
        {errorMessage && <p className="dashboard-message dashboard-message--error">{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <>
            <section className="dashboard-section">
              <h2>Your listings</h2>
              {listings.length === 0 ? (
                <p className="dashboard-empty">No listings yet. Start by posting an item for resale.</p>
              ) : (
                <div className="dashboard-table-wrap">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Verification</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr key={listing.sellID}>
                          <td>{listing.item_name}</td>
                          <td>
                            {listing.verificationStatus || "Pending Review"}
                            {listing.listingCondition || listing.condition ? ` · ${listing.listingCondition || listing.condition}` : ""}
                          </td>
                          <td>Rs {listing.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="dashboard-grid-2">
              <article className="dashboard-panel">
                <h3>Your service requests</h3>
                {requests.length === 0 ? (
                  <p className="dashboard-empty">No service requests found yet.</p>
                ) : (
                  <ul className="dashboard-list">
                    {requests.map((request, index) => (
                      <li key={request.id || index}>
                        <strong>{request.title || request.request_type || "Service request"}</strong>
                        <span>{request.status || "Open"}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <h3 style={{ marginTop: "1.2rem" }}>Your inquiries (sent)</h3>
                {inquiriesSent.length === 0 ? (
                  <p className="dashboard-empty">No inquiries sent yet.</p>
                ) : (
                  <ul className="dashboard-list">
                    {inquiriesSent.map((inquiry, index) => (
                      <li key={inquiry.id || index}>
                        <strong>{inquiry.item_name || "Listing inquiry"}</strong>
                        <span>{inquiry.status || "Sent"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <article className="dashboard-panel">
                <h3>Inquiries (received on your listings)</h3>
                {inquiriesReceived.length === 0 ? (
                  <p className="dashboard-empty">No inquiries received yet.</p>
                ) : (
                  <ul className="dashboard-list">
                    {inquiriesReceived.map((inquiry, index) => (
                      <li key={inquiry.id || index}>
                        <strong>{inquiry.item_name || "Listing inquiry"}</strong>
                        <span>{inquiry.status || "Sent"}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <h3 style={{ marginTop: "1.2rem" }}>Items bought from ReadyCool</h3>
                {purchases.length === 0 ? (
                  <p className="dashboard-empty">No purchases recorded yet.</p>
                ) : (
                  <ul className="dashboard-list">
                    {purchases.map((purchase, index) => (
                      <li key={purchase.id || index}>
                        <strong>{purchase.item_name || purchase.title || "Purchased item"}</strong>
                        <span>Rs {purchase.price || "-"}</span>
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

export default Dashboard;
