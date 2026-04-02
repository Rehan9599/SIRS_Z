import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../api";
import "../styles/dashboard.css";

function Profile(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    jobRole: "",
    city: "",
    addressLine: ""
  });

  useEffect(() => {
    if (!props.isLogged || !props.isLoggedId) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      setMessage({ text: "", type: "" });
      try {
        const response = await fetch(`${API_BASE_URL}/profile/${props.isLoggedId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile.");
        }

        setProfile({
          userName: data.user.userName || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          companyName: data.user.company_name || "",
          jobRole: data.user.job_role || "",
          city: data.user.city || "",
          addressLine: data.user.address_line || "",
          password: ""
        });
      } catch (error) {
        setMessage({ text: error.message, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [props.isLogged, props.isLoggedId, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        userName: profile.userName,
        email: profile.email,
        phone: profile.phone,
        companyName: profile.companyName,
        jobRole: profile.jobRole,
        city: profile.city,
        addressLine: profile.addressLine
      };

      if (profile.password.trim()) {
        payload.password = profile.password;
      }

      const response = await fetch(`${API_BASE_URL}/profile/${props.isLoggedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      if (props.onUpdateUserName) {
        props.onUpdateUserName(profile.userName);
      }

      setProfile((previous) => ({ ...previous, password: "" }));
      setMessage({ text: "Profile updated successfully.", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Header
        showAuth={props.isLogged}
        onLogout={props.onLogout}
        userName={props.userName}
      />

      <main className="dashboard-main">
        <section className="dashboard-hero dashboard-hero--single">
          <div className="dashboard-hero__copy">
            <span className="section-kicker">
              <PersonOutlineOutlinedIcon fontSize="small" />
              <span>Your profile</span>
            </span>
            <h1>View and update your account details.</h1>
            <p>
              Keep your profile information up to date for better listing communication and dashboard tracking.
            </p>
          </div>
        </section>

        <section className="dashboard-section profile-card">
          {isLoading ? (
            <p className="dashboard-message">Loading profile...</p>
          ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              <label htmlFor="userName">Full name</label>
              <input id="userName" name="userName" value={profile.userName} onChange={handleChange} required />

              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={profile.email} onChange={handleChange} required />

              <div className="profile-grid-2">
                <div>
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" value={profile.phone} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" value={profile.city} onChange={handleChange} />
                </div>
              </div>

              <div className="profile-grid-2">
                <div>
                  <label htmlFor="companyName">Company</label>
                  <input id="companyName" name="companyName" value={profile.companyName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="jobRole">Role</label>
                  <input id="jobRole" name="jobRole" value={profile.jobRole} onChange={handleChange} />
                </div>
              </div>

              <label htmlFor="addressLine">Address</label>
              <input id="addressLine" name="addressLine" value={profile.addressLine} onChange={handleChange} />

              <label htmlFor="password">Change password (optional)</label>
              <input id="password" name="password" type="password" value={profile.password} onChange={handleChange} placeholder="Leave empty to keep current password" />

              <button className="action-button action-button--primary" type="submit" disabled={isSaving}>
                <SaveOutlinedIcon fontSize="small" />
                <span>{isSaving ? "Saving..." : "Save changes"}</span>
              </button>

              {message.text && (
                <p className={message.type === "error" ? "dashboard-message dashboard-message--error" : "dashboard-message dashboard-message--success"}>
                  {message.text}
                </p>
              )}
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
