// src/cmps/AdminPush.jsx
import React, { useState, useEffect } from "react";

export function AdminPush() {
    const [pushData, setPushData] = useState({
        en: "",
        he: "",
        isActive: false
    });

    useEffect(() => {
        // Load existing settings (In real app: Fetch from API)
        const savedData = localStorage.getItem('sitePushNotification');
        if (savedData) {
            setPushData(JSON.parse(savedData));
        }
    }, []);

    function handleChange(ev) {
        const field = ev.target.name;
        const value = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
        setPushData(prev => ({ ...prev, [field]: value }));
    }

    function onSave(ev) {
        ev.preventDefault();
        // Save settings (In real app: API call to DB)
        localStorage.setItem('sitePushNotification', JSON.stringify(pushData));
        
        // This line forces the App to refresh data immediately (optional trick for localstorage)
        window.dispatchEvent(new Event("storage")); 
        
        alert("Push Notification Saved!");
    }

    return (
        <section className="admin-push-container">
            <h1>Push Notification Settings</h1>
            
            <form onSubmit={onSave} className="admin-push-form">
                
                {/* Checkbox Toggle */}
                <div className="input-group checkbox-group">
                    <label htmlFor="isActive">Show Notification Bar?</label>
                    <input 
                        type="checkbox" 
                        id="isActive"
                        name="isActive" 
                        checked={pushData.isActive} 
                        onChange={handleChange} 
                    />
                </div>

                {/* English Text */}
                <div className="input-group">
                    <label>Text (English)</label>
                    <textarea 
                        name="en" 
                        value={pushData.en} 
                        onChange={handleChange} 
                        placeholder="" 
                    />
                </div>

                {/* Hebrew Text */}
                <div className="input-group">
                    <label>Text (Hebrew)</label>
                    <textarea 
                        name="he" 
                        value={pushData.he} 
                        onChange={handleChange} 
                        dir="rtl"
                        placeholder="" 
                    />
                </div>

                <button className="save-btn">Save Settings</button>
            </form>
        </section>
    );
}