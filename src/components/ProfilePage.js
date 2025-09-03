import React, { useContext, useMemo, useRef, useState } from "react";
import "./ProfilePage.css";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, loginUser } = useContext(AuthContext);

  const initial = useMemo(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    profilePic: user?.profilePic || "",
  }), [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const onEdit = () => {
    setForm(initial);
    setErrors({});
    setMessage("");
    setIsEditing(true);
  };

  const onCancel = () => {
    setForm(initial);
    setErrors({});
    setMessage("");
    setIsEditing(false);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone)) e.phone = "Invalid phone";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setMessage("");
    try {
      // If there is a backend endpoint, call it here. For now, persist in AuthContext/localStorage.
      const updated = { ...user, ...form };
      loginUser(updated); // updates context + localStorage
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const onPickPhoto = () => fileInputRef.current?.click();

  const onFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // Save as data URL for preview and persistence
      setForm((prev) => ({ ...prev, profilePic: reader.result }));
      setMessage("");
    };
    reader.onerror = () => setMessage("Failed to read the selected file.");
    reader.readAsDataURL(file);
  };

  const display = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    role: user?.role || "Member",
    phone: user?.phone || "-",
    profilePic: user?.profilePic || "https://via.placeholder.com/150",
  };

  return (
    <div className="user-profile-page">
      <div className="user-profile-header">
        <h2>My Profile</h2>
        {!isEditing && (
          <button className="user-profile-edit-btn" onClick={onEdit}>Edit Profile</button>
        )}
      </div>

      <div className="user-profile-card">
        <div className="user-profile-image">
          <img src={isEditing ? (form.profilePic || display.profilePic) : display.profilePic} alt="Profile" />
          {isEditing && (
            <div className="user-photo-edit">
              <button type="button" onClick={onPickPhoto}>Change Photo</button>
              {form.profilePic && (
                <button type="button" className="secondary" onClick={() => setForm((p) => ({ ...p, profilePic: "" }))}>
                  Remove
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileSelected}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
        <div className="user-profile-details">
          {!isEditing ? (
            <>
              <h2>{display.name}</h2>
              <p className="user-role">{display.role}</p>
              <table className="user-profile-details-table">
                <tbody>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{display.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone</strong></td>
                    <td>{display.phone}</td>
                  </tr>
                  <tr>
                    <td><strong>Role</strong></td>
                    <td>{display.role}</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2 style={{ marginBottom: 8 }}>Edit details</h2>
              <table className="user-profile-details-table">
                <tbody>
                  <tr>
                    <td><strong>Name</strong></td>
                    <td>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Your name"
                      />
                      {errors.name && <span className="user-profile-error">{errors.name}</span>}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="you@example.com"
                      />
                      {errors.email && <span className="user-profile-error">{errors.email}</span>}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Phone</strong></td>
                    <td>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="+94 77 123 4567"
                      />
                      {errors.phone && <span className="user-profile-error">{errors.phone}</span>}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Role</strong></td>
                    <td>
                      <select 
                        name="role" 
                        value={form.role} 
                        onChange={onChange}
                      >
                        <option value="">Select role</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Profile Picture URL</strong></td>
                    <td>
                      <input
                        name="profilePic"
                        value={form.profilePic}
                        onChange={onChange}
                        placeholder="Paste image URL or use Change Photo"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="user-profile-actions">
                <button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                <button className="secondary" onClick={onCancel} disabled={saving}>Cancel</button>
              </div>
            </>
          )}

          {message && <p className="user-profile-message">{message}</p>}
        </div>
      </div>

      <p className="user-profile-hint">Tip: Selecting a photo stores it locally. Large images may exceed browser storage limits.</p>
    </div>
  );
};

export default ProfilePage;