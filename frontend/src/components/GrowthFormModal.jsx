import React, { useState, useEffect } from "react";
import { Scale, Ruler, Activity, X } from "lucide-react";
import Input from "./Input.jsx";
import { useGrowthStore } from "./growthStore.js";
import toast from "react-hot-toast";

const GrowthFormModal = ({ isOpen, onClose, selectedChild }) => {
    const { saveGrowth, isLoading } = useGrowthStore();
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState("");

    useEffect(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);
        if (h > 0 && w > 0) {
            const heightInMeters = h / 100;
            const calculatedBmi = w / (heightInMeters * heightInMeters);
            setBmi(calculatedBmi.toFixed(2));
        } else {
            setBmi("");
        }
    }, [height, weight]);

    useEffect(() => {
        if (isOpen) {
            setHeight("");
            setWeight("");
            setBmi("");
        }
    }, [isOpen]);

    if (!isOpen || !selectedChild) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!height || !weight) {
            toast.error("Please fill out all mandatory physical metric parameters.");
            return;
        }

        const todayStr = new Date().toISOString().split("T")[0];
        const result = await saveGrowth({ childId: selectedChild.id, height, weight, bmi, date: todayStr });

        if (result.success) {
            toast.success(result.message);
            onClose();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="modal-overlay" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="modal-card" style={{ maxWidth: "450px", width: "100%" }}>
                
                <div className="modal-header">
                    <div style={{ textAlign: "left" }}>
                        <h3 style={{ margin: 0 }}>Record Health Growth</h3>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#575554" }}>
                            Tracking: <span style={{ color: "#4f46e5", fontWeight: "bold" }}>{selectedChild.name}</span> (Age: {selectedChild.age} Yrs)
                        </p>
                    </div>
                    <button className="close-icon-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form" style={{ marginTop: "15px" }}>
                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.85rem", color: "#333231", display: "block", marginBottom: "6px", fontWeight: "500" }}>
                            Height (in cm)
                        </label>
                        <Input 
                            icon={Ruler} 
                            type="number" 
                            step="0.1" 
                            placeholder="e.g. 95.5" 
                            value={height} 
                            onChange={(e) => setHeight(e.target.value)} 
                            required 
                        />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.85rem", color: "#333231", display: "block", marginBottom: "6px", fontWeight: "500" }}>
                            Weight (in kg)
                        </label>
                        <Input 
                            icon={Scale} 
                            type="number" 
                            step="0.1" 
                            placeholder="e.g. 14.2" 
                            value={weight} 
                            onChange={(e) => setWeight(e.target.value)} 
                            required 
                        />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.85rem", color: "#333231", display: "block", marginBottom: "6px", fontWeight: "500" }}>
                            Calculated Body Mass Index (BMI)
                        </label>
                        <Input 
                            icon={Activity} 
                            type="text" 
                            placeholder="Auto Calculated BMI" 
                            value={bmi} 
                            disabled 
                            style={{ backgroundColor: "#c3c3c3", cursor: "not-allowed" }} 
                        />
                    </div>

                    <button className="btn-primary modal-submit-btn" type="submit" disabled={isLoading} style={{ width: "100%" }}>
                        {isLoading ? "Saving Growth..." : "Submit Growth Record"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GrowthFormModal;