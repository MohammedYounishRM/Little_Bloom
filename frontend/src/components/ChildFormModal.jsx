import React, { useState, useEffect } from "react";
import { User, Calendar, Shield, Phone, MapPin, X } from "lucide-react";
import Input from "./Input.jsx";
import { useChildStore } from "./childStore.js";
import toast from "react-hot-toast";

const ChildFormModal = ({ isOpen, onClose, selectedChild }) => {
    const { addChild, updateChild, isLoading } = useChildStore();

    const [formData, setFormData] = useState({ name: "", age: "", dob: "", gender: "Male", parent_name: "", phone: "", address: "" });

    useEffect(() => {
        if (selectedChild) {
            setFormData({ name: selectedChild.name, age: selectedChild.age, dob: selectedChild.dob, gender: selectedChild.gender, parent_name: selectedChild.parent_name, phone: selectedChild.phone, address: selectedChild.address });
        } else {
            setFormData({ name: "", age: "", dob: "", gender: "Male", parent_name: "", phone: "", address: "" });
        }
    }, [selectedChild, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;
        if (selectedChild) {
            res = await updateChild(selectedChild.id, formData);
        } else {
            res = await addChild(formData);
        }

        if (res.success) {
            toast.success(res.message);
            onClose();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <h3>{selectedChild ? "Edit Child Details" : "Register New Child"}</h3>
                    <button className="close-icon-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <Input icon={User} type="text" name="name" placeholder="Child's Full Name" value={formData.name} onChange={handleChange} required />
                    
                    <div className="form-row-split">
                        <Input icon={Calendar} type="number" name="age" placeholder="Age (Yrs)" value={formData.age} onChange={handleChange} required min="0" max="15" />
                        <Input icon={Calendar} type="date" name="dob" placeholder="DOB" value={formData.dob} onChange={handleChange} required />
                    </div>

                    <div className="gender-container-box">
                        <label className="gender-title-lbl">Gender Identity:</label>
                        <div className="gender-options">
                            <label className="radio-option-lbl">
                                <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
                                <span>Male</span>
                            </label>
                            <label className="radio-option-lbl">
                                <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>

                    <Input icon={Shield} type="text" name="parent_name" placeholder="Parent / Guardian Name" value={formData.parent_name} onChange={handleChange} required />
                    <Input icon={Phone} type="tel" name="phone" placeholder="Parent Contact Number" value={formData.phone} onChange={handleChange} required />
                    
                    <div className="input-group">
                        <div className="input-icon" style={{ alignItems: "flex-start", paddingTop: "5px" }}>
                            <MapPin size={20} />
                        </div>
                        <textarea className="input-field text-area-field" name="address" placeholder="Address Details..." value={formData.address} onChange={handleChange} required rows={3} />
                    </div>

                    <button className="btn-primary modal-submit-btn" type="submit" disabled={isLoading}>
                        {isLoading ? "Saving Record..." : selectedChild ? "Save Modifications" : "Register Child"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChildFormModal;