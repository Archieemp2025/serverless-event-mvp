// import { Calendar, MapPin } from 'lucide-react';

// export default function EventCard({ event }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
//       <div className="p-5">
//         <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
        
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center text-gray-500 text-sm gap-2">
//             <Calendar size={16} className="text-purple-600" />
//             <span>{event.date}</span>
//           </div>
//           <div className="flex items-center text-gray-500 text-sm gap-2">
//             <MapPin size={16} className="text-purple-600" />
//             <span>{event.location}</span>
//           </div>
//         </div>

//         <button className="w-full py-2 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition-colors">
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// }


// Update 01 // 

// import { useState } from 'react';
// import axios from 'axios';
// import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

// export default function EventCard({ event }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-all">
//       {/* Date and Time Badges */}
//       <div className="flex gap-2">
//         <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//           <Calendar size={14} /> {event.date || 'TBD'}
//         </span>
//         <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//           <Clock size={14} /> {event.time || '09:00 AM'}
//         </span>
//       </div>

//       <h3 className="text-xl font-bold text-gray-900 leading-tight">
//         {event.title}
//       </h3>

//       <div className="space-y-2 text-gray-500 text-sm">
//         <div className="flex items-center gap-2">
//           <MapPin size={16} className="text-gray-400" />
//           <span>{event.location}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Users size={16} className="text-gray-400" />
//           <span>{event.registeredCount || 0} People Registered</span>
//         </div>
//       </div>

//       <button className="mt-2 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
//         Register Now
//       </button>
//     </div>
//   );
// }


// Update 02 - RegisterUser Version 1// 

// import { useState } from 'react';
// import axios from 'axios';
// import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

// export default function EventCard({ event }) {
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     setLoading(true);
//     try {
//       // Points to your RegisterUser function
//       const REGISTER_URL = "https://event-api-wic-czdvc8bwfsb7drag.australiaeast-01.azurewebsites.net/api/RegisterUser";
      
//       await axios.post(REGISTER_URL, {
//         eventId: event.id,
//         email: "testuser@example.com" // Match the 'email' key expected by your Azure function
//       });

//       setIsRegistered(true);
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert("Could not register. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-all">
//       {/* Date and Time Badges */}
//       <div className="flex gap-2">
//         <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//           <Calendar size={14} /> {event.date || 'TBD'}
//         </span>
//         <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//           <Clock size={14} /> {event.time || '09:00 AM'}
//         </span>
//       </div>

//       <h3 className="text-xl font-bold text-gray-900 leading-tight">
//         {event.title}
//       </h3>

//       <div className="space-y-2 text-gray-500 text-sm">
//         <div className="flex items-center gap-2">
//           <MapPin size={16} className="text-gray-400" />
//           <span>{event.location}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Users size={16} className="text-gray-400" />
//           <span>{event.registeredCount || 0} People Registered</span>
//         </div>
//       </div>

//       <button 
//         onClick={handleRegister}
//         disabled={loading || isRegistered}
//         className={`mt-2 w-full py-3 font-bold rounded-xl transition-all shadow-lg 
//           ${isRegistered 
//             ? 'bg-green-100 text-green-700 shadow-none flex items-center justify-center gap-2' 
//             : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
//           } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//       >
//         {loading ? "Processing..." : isRegistered ? (
//           <><CheckCircle size={18} /> Registered!</>
//         ) : "Register Now"}
//       </button>
//     </div>
//   );
// }


// Update 03 - Register User 03 // 

import { useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, CheckCircle, X } from 'lucide-react';

export default function EventCard({ event }) {
  const [showModal, setShowModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ fullName: '', mobile: '', email: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const REGISTER_URL = "https://event-api-wic-czdvc8bwfsb7drag.australiaeast-01.azurewebsites.net/api/RegisterUser";
      await axios.post(REGISTER_URL, { ...formData, eventId: event.id });
      setIsRegistered(true);
      setTimeout(() => setShowModal(false), 2000); // Close modal after success
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      {/* Event Details (Badges, Title, etc.) */}
      <div className="flex gap-2">
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Calendar size={14} /> {event.date}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>

      {/* Main Action Button */}
      <button 
        onClick={() => !isRegistered && setShowModal(true)}
        className={`mt-2 w-full py-3 font-bold rounded-xl transition-all ${isRegistered ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {isRegistered ? " Registered" : "Register Now"}
      </button>

      {/* --- REGISTRATION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Register for Event</h2>
            <p className="text-gray-500 mb-6">{event.title}</p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email ID</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all mt-4">
                {loading ? "Registering..." : isRegistered ? "Success!" : "Complete Registration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}