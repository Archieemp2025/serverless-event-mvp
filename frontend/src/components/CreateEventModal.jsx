import React, { useState } from 'react';

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        date: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/CreateEvent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                onEventCreated(result.event); //
                onClose(); //
            }
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Event</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Event Title" 
                        required 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    />
                    <input 
                        type="text" 
                        placeholder="Location" 
                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                    />
                    <input 
                        type="datetime-local" 
                        required 
                        onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    />
                    <textarea 
                        placeholder="Description" 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                    <button type="submit">Publish Event</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};