import React, { useState } from 'react';
import axios from 'axios';
import { X, Calendar, MapPin, AlignLeft, PlusCircle } from 'lucide-react';

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        date: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Get Base URL from environment variables
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const CREATE_URL = `${BASE_URL}/CreateEvent`;
            
            // 2. Use Axios (matches your EventCard pattern)
            const response = await axios.post(CREATE_URL, formData);

            if (response.status === 201) {
                onEventCreated(response.data.event);
                onClose();
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert(error.response?.data?.error || "Failed to create event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Event</h2>
                <p className="text-gray-500 mb-6 font-medium">Add details for your next community gathering.</p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* Event Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <PlusCircle size={16} className="text-indigo-600" /> Event Title
                        </label>
                        <input 
                            required 
                            placeholder="e.g. Data Science Workshop"
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-600" /> Location
                        </label>
                        <input 
                            required 
                            placeholder="e.g. Monash University Clayton"
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            onChange={(e) => setFormData({...formData, location: e.target.value})} 
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-600" /> Date & Time
                        </label>
                        <input 
                            required 
                            type="datetime-local" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            onChange={(e) => setFormData({...formData, date: e.target.value})} 
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <AlignLeft size={16} className="text-indigo-600" /> Description
                        </label>
                        <textarea 
                            rows="3"
                            placeholder="Tell attendees what to expect..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all mt-4 shadow-lg shadow-indigo-100 disabled:bg-gray-300"
                    >
                        {loading ? "Publishing..." : "Publish Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;