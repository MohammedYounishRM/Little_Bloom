import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Search, Calendar, Save, Loader, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useChildStore } from "./childStore.js";

const API_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/attendance` : "http://localhost:5000/api/attendance";
axios.defaults.withCredentials = true;

const Attendance = () => {
    const { children, isLoading: isChildrenLoading, fetchChildren } = useChildStore();
    const [attendanceState, setAttendanceState] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isCheckingLogs, setIsCheckingLogs] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [historyLogs, setHistoryLogs] = useState([]);
    const [showHistoryPopup, setShowHistoryPopup] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const today = new Date();
    const getLocalYYYYMMDD = () => {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const targetDateString = getLocalYYYYMMDD();
    
    const formattedDisplayDate = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    useEffect(() => {
        const initializeAttendance = async () => {
            setIsCheckingLogs(true);
            try {
                await fetchChildren();
                const response = await axios.get(`${API_URL}/today-status?date=${targetDateString}`);
            
                if (response.data.success && response.data.savedBefore) {
                    const savedStates = {};
                    response.data.records.forEach(rec => {
                        savedStates[rec.childId] = rec.status;
                    });
                    setAttendanceState(savedStates);
                    setHasInteracted(true);
                    toast.success("Loaded today's existing attendance logs.");
                } else {
                    setAttendanceState({});
                    setHasInteracted(false);
                }
            } catch (err) {
                toast.error("Failed to sync daily attendance.");
            } finally {
                setIsCheckingLogs(false);
            }
        };

        initializeAttendance();
    }, [fetchChildren, targetDateString]);

    const handleStatusToggle = (id, status) => {
        setHasInteracted(true);
        setAttendanceState((prev) => ({ ...prev, [id]: status }));
    };

    const handleSaveAttendance = async () => {
        if (Object.keys(attendanceState).length === 0) {
            toast.error("Please mark status logs before saving.");
            return;
        }
        try {
            setIsSaving(true);
            
            const attendancePayload = (children || []).map(child => {
                const cId = child.id || child._id;
                return {
                    childId: String(cId),
                    status: attendanceState[cId] || "Absent"
                };
            });

            const response = await axios.post(`${API_URL}/save-daily`, {
                date: targetDateString,
                records: attendancePayload,
            });

            if (response.data.success) {
                toast.success("Daily attendance sheets saved successfully!");
            }
        } catch (err) {
            console.error("Save execution fault:", err);
            toast.error(err.response.data.message || "Error connecting to database servers.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFetchHistoryList = async () => {
        try {
            const response = await axios.get(`${API_URL}/history`);
            if (response.data.success) {
                setHistoryLogs(response.data.history);
                setShowHistoryPopup(true);
            }
        } catch (err) {
            toast.error("Could not load attendance historical record summaries.");
        }
    };

    const totalCount = children ? children.length : 0;
    const presentCount = Object.values(attendanceState).filter((status) => status === "Present").length;
    const absentCount = Object.values(attendanceState).filter((status) => status === "Absent").length;

    const filteredChildren = (children || []).filter((child) => {
        const childId = String(child.id || child._id);
        const childName = String(child.name);
        return (
            childName.toLowerCase().includes(searchQuery.toLowerCase()) || childId.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    if (isChildrenLoading || isCheckingLogs) {
        return (
            <div className="attendance-loading-view">
                <Loader className="animate-spin loader-icon" size={32} />
                <p className="attendance-loading-paragraph">Please wait... We are Syncing informations...</p>
            </div>
        );
    }

    return (
        <div className="attendance-view-wrapper">
            <div className="overview-top-deck-flex">
                <div className="welcome-banner-greeting">
                    <h2>Daily <span className="highlight-text">Attendance Sheet</span></h2>
                    <p className="subtext-motivational">Verify and check off the children currently present at your center hub today.</p>
                </div>
                
                <div className="live-date-header-badge" onClick={handleFetchHistoryList}>
                    <Calendar size={18} />
                    <div className="date-time-stack-text">
                        <span className="date-today-lbl">Current Date</span>
                        <span className="date-string-value">{formattedDisplayDate}</span>
                    </div>
                </div>
            </div>

            <div className="attendance-metrics-grid">
                <div className="metric-scorecard-card">
                    <span className="scorecard-title-label">Total Active Children</span>
                    <div className="scorecard-numeric-badge strength-box">{totalCount}</div>
                </div>
                
                <div className="metric-scorecard-card">
                    <span className="scorecard-title-label">Present Today</span>
                    <div className={`scorecard-numeric-badge ${hasInteracted ? 'present-box' : 'uninteracted-box'}`}>
                        {hasInteracted ? presentCount : "-"}
                    </div>
                </div>
                
                <div className="metric-scorecard-card">
                    <span className="scorecard-title-label">Absent Today</span>
                    <div className={`scorecard-numeric-badge ${hasInteracted ? 'absent-box' : 'uninteracted-box'}`}>
                        {hasInteracted ? absentCount : "-"}
                    </div>
                </div>
            </div>

            <div className="attendance-table-box">
                <div className="attendance-action-header">
                    <div className="input-group" style={{ margin: 0, flex: 1 }}>
                        <div className="input-icon">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            className="input-field"
                            placeholder="Search child by name / id..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: "#f8fafc", borderColor: "#cbd5e1", color: "#1e293b" }} />
                    </div>
                    <button
                        className="shortcut-action-btn register-child-theme save-attendance-btn" 
                        onClick={handleSaveAttendance}
                        disabled={isSaving || totalCount === 0} >
                        {isSaving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>Save Daily Attendance Logs</span>
                    </button>
                </div>

                {filteredChildren.length === 0 ? (
                    <div className="attendance-empty-state">
                        <XCircle size={40} className="empty-state-graphic color-muted" />
                        <h3>No Children Records Found</h3>
                        <p>Verify spelling parameters or register new profiles inside the child management workspace.</p>
                    </div>
                    ) : (
                    <div className="attendance-list-container">
                        {filteredChildren.map((child) => {
                            const childId = child.id || child._id;
                            const currentStatus = attendanceState[childId];

                            return (
                                <div key={childId} className="mini-child-row-item shadow-row">
                                    <div className="child-info-column">
                                        <div className="mini-child-name-text">
                                            {child.name}
                                        </div>
                                        <div className="mini-child-metadata">
                                            Parent: <span className="meta-highlight">{child.parent_name || "N/A"}</span> | ID: <span className="unique-id-tag id-badge-text">{String(childId).substring(0,8).toUpperCase()}</span>
                                        </div>
                                    </div>

                                    <div className="attendance-toggle-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleStatusToggle(childId, "Present")}
                                            className={`status-toggle-btn btn-present ${currentStatus === "Present" ? "active" : ""}`}>
                                            <CheckCircle2 size={16} />
                                            Present
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusToggle(childId, "Absent")}
                                            className={`status-toggle-btn btn-absent ${currentStatus === "Absent" ? "active" : ""}`} >
                                            <XCircle size={16} />
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showHistoryPopup && (
                <div className="modal-overlay-blur">
                    <div className="history-modal-card">
                        <div className="history-modal-header">
                            <h3>Attendance Log History</h3>
                            <button onClick={() => setShowHistoryPopup(false)} className="close-modal-x">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="history-scroll-container">
                            {historyLogs.length === 0 ? (
                                <p className="history-empty-msg">No logs committed to database storage yet.</p>
                            ) : (
                                historyLogs.map((log, idx) => {
                                    const formattedLogDate = log.date ? new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";
                                    return (
                                        <div key={idx} className="history-log-row">
                                            <span className="history-log-date">
                                                {formattedLogDate}
                                            </span>
                                            <div className="history-badge-group">
                                                <span className="badge-present">Present: {log.present_count}</span>
                                                <span className="badge-absent">Absent: {log.absent_count}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;