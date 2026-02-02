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


import { useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

export default function EventCard({ event }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Points to your RegisterUser function
      const REGISTER_URL = "https://event-api-wic-czdvc8bwfsb7drag.australiaeast-01.azurewebsites.net/api/RegisterUser";
      
      await axios.post(REGISTER_URL, {
        eventId: event.id,
        email: "testuser@example.com" // Match the 'email' key expected by your Azure function
      });

      setIsRegistered(true);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Could not register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-all">
      {/* Date and Time Badges */}
      <div className="flex gap-2">
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Calendar size={14} /> {event.date || 'TBD'}
        </span>
        <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Clock size={14} /> {event.time || '09:00 AM'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 leading-tight">
        {event.title}
      </h3>

      <div className="space-y-2 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <span>{event.registeredCount || 0} People Registered</span>
        </div>
      </div>

      <button 
        onClick={handleRegister}
        disabled={loading || isRegistered}
        className={`mt-2 w-full py-3 font-bold rounded-xl transition-all shadow-lg 
          ${isRegistered 
            ? 'bg-green-100 text-green-700 shadow-none flex items-center justify-center gap-2' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Processing..." : isRegistered ? (
          <><CheckCircle size={18} /> Registered!</>
        ) : "Register Now"}
      </button>
    </div>
  );
}