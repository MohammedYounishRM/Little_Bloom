import React, { useEffect, useState } from "react";
import { useChildStore } from "./childStore.js"; 
import { Edit, Trash2, UserPlus, HelpCircle, Loader } from "lucide-react"; 
import ChildFormModal from "./ChildFormModal.jsx"; 
import Swal from "sweetalert2"; 

const ChildManagement = () => {
    const { children, fetchChildren, deleteChild, isLoading } = useChildStore(); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedChild, setSelectedChild] = useState(null); 

    useEffect(() => {
        fetchChildren(); 
    }, []);

    const handleOpenAddModal = () => {
        setSelectedChild(null); 
        setIsModalOpen(true); 
    };

    const handleOpenEditModal = (child) => {
        setSelectedChild(child); 
        setIsModalOpen(true); 
    };

    const handleDeleteClick = (id, name) => {
        Swal.fire({
            title: `Delete profile of ${name}?`, 
            text: "This action cannot be undone.", 
            icon: "warning", 
            showCancelButton: true, 
            confirmButtonColor: "#ef4444", 
            cancelButtonColor: "#6b7280", 
            confirmButtonText: "Yes, delete it!" 
        }).then(async (result) => {
            if (result.isConfirmed) {
                const action = await deleteChild(id); 
                if (action.success) {
                    Swal.fire("Deleted!", "Profile removed safely.", "success"); 
                } else {
                    Swal.fire("Failed", action.message, "error"); 
                }
            }
        });
    };

    if (isLoading && children.length === 0) { 
        return <div className="placeholder-view"><Loader className="animate-spin loader-icon" size={32} /><h3>Loading Children's Details...</h3></div>; 
    }

    return (
        <div className="management-container-panel">
            <div className="content-deck-header">
                <div>
                    <h2>Child Management</h2> 
                    <p className="section-description-sub">Manage registered profiles and information details of every child</p> 
                </div>
                <button className="btn-primary" onClick={handleOpenAddModal} style={{ width: 'auto' }}>
                    <UserPlus size={18} /> Add New Child 
                </button>
            </div>

            {(!children || children.length === 0) ? ( 
                <div className="empty-state-viewbox">
                    <HelpCircle size={48} className="empty-state-graphic" /> 
                    <h3>No Children Datas Found</h3> 
                    <p>Click the "Add New Child" button at the top right to build your workspace.</p> 
                </div>
            ) : (
                <div className="child-profile-cards-grid"> 
                    {children.map((child) => ( 
                        <div key={child.id} className="child-identity-card">
                            <div className="card-top-identity-row" style={{ display: 'flex', alignItems: 'center', width: '100%' }}> 
                                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                    <div className="avatar-initials-placeholder"> 
                                        {child.name ? child.name.charAt(0).toUpperCase() : "C"} 
                                    </div>
                                    <div className="identity-title-stack"> 
                                        <h4>{child.name}</h4> 
                                        <span className="unique-id-tag">ID: {child.id ? child.id.substring(0, 8).toUpperCase() : "N/A"}</span> 
                                    </div>
                                </div>
                                
                                {child.latest_bmi && (
                                    <div className="bmi-badge" style={{
                                        backgroundColor: '#2e2a24',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.88rem',
                                        fontWeight: 'bold',
                                        color: '#f0f0e7',
                                        textAlign: 'right',
                                        marginLeft: 'auto',
                                        flexShrink: 0
                                    }}>
                                        <span style={{ fontSize: '0.7rem', display: 'block', color: '#a8a29e', fontWeight: 'normal' }}>BMI</span>
                                        {parseFloat(child.latest_bmi).toFixed(1)}
                                    </div>
                                )}
                            </div>
                            
                            <div className="card-demographics-body"> 
                                <div className="meta-detail-pill"><strong>Age:</strong> {child.age} Yrs</div> 
                                <div className="meta-detail-pill"><strong>Gender:</strong> {child.gender}</div> 
                                <div className="meta-detail-block-row"><strong>Guardian:</strong> {child.parent_name}</div> 
                                <div className="meta-detail-block-row"><strong>Phone:</strong> {child.phone}</div> 
                                <div className="meta-detail-block-row text-truncate-clamp"><strong>Address:</strong> {child.address}</div> 
                            </div>

                            <div className="card-actions-footer-bar"> 
                                <button className="action-footer-btn edit-trigger" onClick={() => handleOpenEditModal(child)}> 
                                    <Edit size={14} /> Edit
                                </button>
                                <button className="action-footer-btn delete-trigger" onClick={() => handleDeleteClick(child.id, child.name)}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ChildFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedChild={selectedChild} />
        </div>
    );
};

export default ChildManagement;