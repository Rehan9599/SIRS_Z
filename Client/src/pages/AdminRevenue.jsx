import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/admin.css";

const revenueSummary = [
  { label: "Year total", value: "Rs 42.8L" },
  { label: "Month total", value: "Rs 4.6L" },
  { label: "Week total", value: "Rs 91K" },
  { label: "Pending payments", value: "Rs 1.2L" }
];

const revenueRows = [
  { period: "This week", earnings: "Rs 91K", loss: "Rs 14K", profit: "Rs 77K", payments: "Rs 18K" },
  { period: "This month", earnings: "Rs 4.6L", loss: "Rs 63K", profit: "Rs 3.97L", payments: "Rs 72K" },
  { period: "This year", earnings: "Rs 42.8L", loss: "Rs 5.9L", profit: "Rs 36.9L", payments: "Rs 5.1L" }
];

function AdminRevenue(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isLogged || !props.isAdmin) {
      navigate("/login", { replace: true });
    }
  }, [props.isLogged, props.isAdmin, navigate]);

  return (
    <div className="admin-page">
      <Header showAuth={props.isLogged} onLogout={props.onLogout} userName={props.userName} isAdmin={props.isAdmin} />

      <main className="admin-main">
        <section className="admin-hero glass-card">
          <div className="admin-hero__copy">
            <span className="section-kicker">
              <span>Revenue</span>
            </span>
            <h1>Profit, loss, and earnings overview</h1>
            <p>Dummy finance dashboard for annual, monthly, and weekly revenue tracking.</p>
          </div>

          <div className="admin-quick-links">
            <Link className="action-button action-button--ghost" to="/admin/users">
              <span>Users</span>
            </Link>
            <Link className="action-button action-button--ghost" to="/admin/workers">
              <span>Workers</span>
            </Link>
          </div>
        </section>

        <section className="admin-metrics">
          {revenueSummary.map((item) => (
            <article key={item.label} className="admin-metric-card glass-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="admin-panel glass-card">
          <div className="admin-panel__head">
            <div>
              <h2>Finance breakdown</h2>
              <p>Revenue, payments, and loss data for planning and review.</p>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table admin-table--subpage">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Total Earnings</th>
                  <th>Loss</th>
                  <th>Profit</th>
                  <th>Payments</th>
                </tr>
              </thead>
              <tbody>
                {revenueRows.map((row) => (
                  <tr key={row.period}>
                    <td>{row.period}</td>
                    <td>{row.earnings}</td>
                    <td>{row.loss}</td>
                    <td>{row.profit}</td>
                    <td>{row.payments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AdminRevenue;
