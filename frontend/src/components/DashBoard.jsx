import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore.js";
import { useDashBoardStore } from "./dashBoardStore.js";
import { Calendar, CheckCircle2, PlusCircle, Clock, User2 } from "lucide-react";

const DashBoard = () => {
    const { user } = useAuthStore();
    const { metrics, recentChildren, fetchDashboardMetrics, setActiveTab } = useDashBoardStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardMetrics();
        const timeClockTicker = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timeClockTicker);
    }, []);

    const formatTeacherName = (nameString) => {
        if (!nameString) return "Teacher";
        return nameString.charAt(0).toUpperCase() + nameString.slice(1);
    };

    const getDynamicGreetingString = () => {
        const hrs = currentTime.getHours();
        if (hrs < 12) return "Good Morning";
        if (hrs < 16) return "Good Afternoon";
        if (hrs < 19) return "Good Evening";
        return "Good Night";
    };

    return (
        <div className="overview-subview-wrapper">
            <div className="overview-top-deck-flex">
                <div className="welcome-banner-greeting">
                    <h2>{getDynamicGreetingString()}, <span className="highlight-text">{formatTeacherName(user.name)}</span></h2>
                    <p className="subtext-motivational">Have a great day serving your little learners!</p>
                </div>
                
                <div className="live-date-header-badge">
                    <Calendar size={18} />
                    <div className="date-time-stack-text">
                        <span className="date-today-lbl">Today</span>
                        <span className="date-string-value">{currentTime.toLocaleDateString('en-GB')}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-mesh">
                <div className="metrics-column-flex">
                    <div className="metric-scorecard-card">
                        <span className="scorecard-title-label">Total Strength</span>
                        <div className="scorecard-numeric-badge strength-box">{metrics.totalStrength}</div>
                    </div>
                    
                    <div className="metric-scorecard-card">
                        <span className="scorecard-title-label">Present Today</span>
                        <div className="scorecard-numeric-badge present-box">{metrics.presentCount}</div>
                    </div>
                    
                    <div className="metric-scorecard-card">
                        <span className="scorecard-title-label">Absent Today</span>
                        <div className="scorecard-numeric-badge absent-box">{metrics.absentCount}</div>
                    </div>

                    <div className="recent-children-preview-box">
                        <h3>Children's List Preview</h3>
                        <div 
                            className="preview-list-container"
                            style={{
                                height: "103px",
                                overflowY: "auto",
                                paddingRight: "6px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px"
                            }} >
                            {recentChildren.length === 0 ? (
                                <p className="empty-sub-list-text">No children mapped yet.</p>
                            ) : (
                                recentChildren.map((child) => (
                                    <div key={child.id} className="mini-child-row-item">
                                        <span className="mini-child-name">{child.name}</span>
                                        <span className="mini-child-id-lbl">ID: {String(child.id).substring(0,8).toUpperCase()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="meta-actions-column-stack">
                    <div className="teacher-profile-identity-card">
                        <div className="profile-heading-lbl">Profile</div>
                        <div className="profile-avatar-circle">
                            <User2 size={42} className="avatar-wireframe-svg" />
                        </div>
                        <h4 className="profile-identity-name">{formatTeacherName(user.name)}</h4>
                        <p className="profile-center-meta">{user.center_name}</p>
                        <p className="profile-center-id-tag">ID: {user.center_id}</p>
                    </div>

                    <div className="quick-actions-panel">
                        <button className="shortcut-action-btn mark-attendance-theme" onClick={() => navigate("/attendance")}>
                            <CheckCircle2 size={18} />
                            <span>Mark Attendance</span>
                        </button>

                        <button className="shortcut-action-btn register-child-theme" onClick={() => navigate("/child-management")}>
                            <PlusCircle size={18} />
                            <span>Add New Child</span>
                        </button>
                    </div>

                    <div className="dashboard-digital-clock-card">
                        <Clock size={20} className="clock-pulse-icon" />
                        <span className="digital-time-string">
                            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;