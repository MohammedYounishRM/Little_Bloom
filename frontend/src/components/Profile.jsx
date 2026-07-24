import React, { useState } from "react";
import { useAuthStore } from "./authStore.js";
import { User, Mail, Phone, Building, Hash, Calendar, Edit2, Check, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ProfilePage = () => {
    const { user, updateProfile, logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ name: user.name, phone: user.phone, center_name: user.center_name, center_id: user.center_id });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const result = await updateProfile(formData);
            if (result && result.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to update profile settings.");
        }
    };

    const handleCancel = () => {
        setFormData({ name: user.name, phone: user.phone, center_name: user.center_name, center_id: user.center_id });
        setIsEditing(false);
    };

    const handleMobileLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be securely logged out of your currently working session!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Log out!",
            cancelButtonText: "Stay"
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (logout) {
                    await logout();
                    navigate("/");
                } else {
                    localStorage.clear();
                    navigate("/login");
                }
            }
        });
    };

    if (!user) {
        return (
            <div className="profile-view-wrapper" style={{ padding: "2rem", textAlign: "center" }}>
                <p>Loading Profile data...</p>
            </div>
        );
    }

    return (
        <div className="profile-view-wrapper">
            <div className="profile-card">
                <div className="profile-card-actions">
                    {!isEditing ? (
                        <button 
                            className="profile-edit-trigger-btn" 
                            onClick={() => setIsEditing(true)}
                            title="Edit Profile"
                            type="button" >
                            <Edit2 size={18} />
                        </button>
                    ) : (
                        <div className="profile-editing-controls">
                            <button className="profile-control-btn save-btn" onClick={handleSave} title="Save changes" type="button">
                                <Check size={18} />
                            </button>
                            <button className="profile-control-btn cancel-btn" onClick={handleCancel} title="Cancel" type="button">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-card-header">
                    <div className="profile-avatar-large">
                        {formData.name.charAt(0).toUpperCase()}
                    </div>
                    <h2>{formData.name}</h2>
                    <p className="profile-role-badge">Assigned Center Instructor</p>
                </div>

                <form onSubmit={handleSave} className="profile-details-grid">
                    <div className="profile-field-group">
                        <label className="field-label"><User size={14} /> Full Name</label>
                        <input 
                            type="text"
                            name="name"
                            className={`profile-input-field ${isEditing ? 'editable' : 'readonly'}`}
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="profile-field-group">
                        <label className="field-label"><Phone size={14} /> Contact Number</label>
                        <input 
                            type="tel"
                            name="phone"
                            className={`profile-input-field ${isEditing ? 'editable' : 'readonly'}`}
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="profile-field-group">
                        <label className="field-label"><Building size={14} /> Center Name</label>
                        <input 
                            type="text" 
                            name="center_name"
                            className={`profile-input-field ${isEditing ? 'editable' : 'readonly'}`}
                            value={formData.center_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="profile-field-group locked">
                        <label className="field-label"><Mail size={14} /> Registered Email Address</label>
                        <div className="profile-static-value">
                            {user.email}
                        </div>
                    </div>

                    <div className="profile-field-group locked">
                        <label className="field-label"><Hash size={14} /> Center Unique ID</label>
                        <input 
                            type="text" 
                            name="center_id"
                            className={`profile-input-field ${isEditing ? 'editable' : 'readonly'}`}
                            value={formData.center_id}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="profile-field-group locked">
                        <label className="field-label"><Calendar size={14} /> Account Created On</label>
                        <div className="profile-static-value">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'numeric', day: 'numeric'
                            }) : "Recent"}
                        </div>
                    </div>
                </form>

                {user.isVerified && (
                    <div className="profile-security-footer">
                        <span className="security-verified-status">
                            ✓ Verified System Administrator Account
                        </span>
                    </div>
                )}
            </div>

            <button 
                className="mobile-floating-logout-btn"
                onClick={handleMobileLogout}
                aria-label="Sign out"
                type="button">
                <LogOut size={22} />
            </button>
        </div>
    );
};

export default ProfilePage;