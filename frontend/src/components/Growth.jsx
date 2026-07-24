import React, { useEffect, useState } from "react";
import { useChildStore } from "./childStore.js";
import { Activity, Search, HelpCircle, Loader } from "lucide-react";
import GrowthFormModal from "./GrowthFormModal.jsx";

const Growth = () => {
    const { children, fetchChildren, isLoading } = useChildStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);

    useEffect(() => {
        fetchChildren();
    }, []);

    const handleOpenModal = (child) => {
        setSelectedChild(child);
        setIsModalOpen(true);
    };

    const filteredChildren = (children || []).filter((child) =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading && children.length === 0) { 
        return <div className="placeholder-view"><Loader className="animate-spin loader-icon" size={32} /><h3>Loading Children details...</h3></div>; 
    }

    return (
        <div className="management-container-panel">
            <div className="content-deck-header">
                <div>
                    <h2>Children Health & Growth Tracker</h2> 
                    <p className="section-description-sub">Monitor child metric configurations and update active profiles regularly.</p> 
                </div>
                
                <div className="input-group" style={{ margin: 0, maxWidth: "300px" }}>
                    <div className="input-icon">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        className="input-field"
                        placeholder="Search child by name or id..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: "#f8fafc", borderColor: "#cbd5e1", color: "#1e293b" }}
                    />
                </div>
            </div>

            {(!filteredChildren || filteredChildren.length === 0) ? ( 
                <div className="empty-state-viewbox">
                    <HelpCircle size={48} className="empty-state-graphic" /> 
                    <h3>No Children Found</h3> 
                    <p>No matching workspace profiles discovered for this query.</p> 
                </div>
            ) : (
                <div className="child-profile-cards-grid"> 
                    {filteredChildren.map((child) => ( 
                        <div key={child.id} className="child-identity-card"> 
                            <div className="card-top-identity-row"> 
                                <div className="avatar-initials-placeholder"> 
                                    {child.name ? child.name.charAt(0).toUpperCase() : "C"} 
                                </div>
                                <div className="identity-title-stack"> 
                                    <h4>{child.name}</h4> 
                                    <span className="unique-id-tag">ID: {child.id ? child.id.substring(0, 8).toUpperCase() : "N/A"}</span> 
                                </div>
                            </div>
                            
                            <div className="card-demographics-body"> 
                                <div className="meta-detail-pill"><strong>Age:</strong> {child.age} Yrs</div> 
                                <div className="meta-detail-pill"><strong>Gender:</strong> {child.gender}</div> 
                                <div className="meta-detail-block-row"><strong>Guardian:</strong> {child.parent_name}</div> 
                                <div className="meta-detail-block-row"><strong>Phone:</strong> {child.phone}</div> 
                                <div className="meta-detail-block-row text-truncate-clamp"><strong>Address:</strong> {child.address}</div> 
                            </div>

                            <div className="card-actions-footer-bar"> 
                                <button 
                                    className="btn-primary" 
                                    onClick={() => handleOpenModal(child)}
                                    style={{ width: "100%", justifyContent: "center", gap: "6px" }} > 
                                    <Activity size={14} /> Record Growth Metrics
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <GrowthFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedChild={selectedChild} />
        </div>
    );
};

export default Growth;