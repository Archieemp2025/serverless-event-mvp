// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'


// import './index.css'

// import { useEffect } from 'react';
// import axios from 'axios';
// import { Search, Calendar as LogoIcon } from 'lucide-react'; // Renamed for logo
// import EventCard from './components/EventCard';


// function App() {
//   const [events, setEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const API_URL = "https://event-api-wic-czdvc8bwfsb7drag.australiaeast-01.azurewebsites.net/api/getevents";
//   //   axios.get(API_URL)
//   //     .then(res => { setEvents(res.data); setLoading(false); })
//   //     .catch(() => setLoading(false));
//   // }, []);
  
//   useEffect(() => {
//     // 1. Get the Base URL from the environment
//     const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
//     // 2. Combine it with the specific function name
//     const API_URL = `${BASE_URL}/getevents`;

//     console.log("Connecting to:", API_URL); // Useful for debugging!

//     axios.get(API_URL)
//       .then(res => { 
//         setEvents(res.data); 
//         setLoading(false); 
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//         setLoading(false); 
//       });
//   }, []);
  
//   // Filtering Logic
//   const filteredEvents = events.filter(event => 
//     event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">
//       {/* Figma Header */}
//       <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
//         <div className="flex items-center gap-2">
//           <div className="bg-indigo-600 p-2 rounded-lg text-white">
//             <LogoIcon size={24} />
//           </div>
//           <h1 className="text-2xl font-black text-slate-800 tracking-tight">Evently MVP</h1>
//         </div>
//         <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all">
//           Create Event
//         </button>
//       </header>

//       <main className="max-w-7xl mx-auto p-8">
//         {/* Search Bar */}
//         <div className="relative max-w-md mb-10">
//           <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
//           <input 
//             type="text"
//             placeholder="Search events by name or location..."
//             className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20 text-slate-400 font-medium">Loading events...</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredEvents.map(event => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;



///// Updated on 05/03/26 ////
// import { useState, useEffect } from 'react' // Added useState here
// import './index.css'
// import axios from 'axios';
// import { Search, Calendar as LogoIcon, Plus } from 'lucide-react'; 
// import EventCard from './components/EventCard';
// import CreateEventModal from './components/CreateEventModal'; // 1. Import your new component
// import Header from './components/Header'; // Adjust path if needed

// function App() {
//   const [events, setEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
  
//   // 2. State to control the Modal visibility
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const BASE_URL = import.meta.env.VITE_API_BASE_URL;
//     const API_URL = `${BASE_URL}/getevents`;

//     console.log("Connecting to:", API_URL);

//     axios.get(API_URL)
//       .then(res => { 
//         setEvents(res.data); 
//         setLoading(false); 
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//         setLoading(false); 
//       });
//   }, []);
  
//   // 3. Callback to update the list when a new event is created
//   const handleNewEvent = (newEvent) => {
//     // This adds the new event to the very beginning of the array
//     setEvents([newEvent, ...events]); 
//   };

//   const filteredEvents = events.filter(event => 
//     event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">
//       {/* Figma Header */}
//       <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
//         <div className="flex items-center gap-2">
//           <div className="bg-indigo-600 p-2 rounded-lg text-white">
//             <LogoIcon size={24} />
//           </div>
//           <h1 className="text-2xl font-black text-slate-800 tracking-tight">Evently MVP</h1>
//         </div>

//         {/* 4. Trigger the Modal on click */}
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
//         >
//           <Plus size={20} /> Create Event
//         </button>
//       </header>

//       <main className="max-w-7xl mx-auto p-8">
//         {/* Search Bar */}
//         <div className="relative max-w-md mb-10">
//           <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
//           <input 
//             type="text"
//             placeholder="Search events by name or location..."
//             className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20 text-slate-400">
//              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
//              <p className="font-medium">Loading events...</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredEvents.map(event => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         )}
//       </main>

//       {/* 5. The Modal Component */}
//       <CreateEventModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onEventCreated={handleNewEvent} 
//       />
//     </div>
//   );
// }

// export default App;


// New Update//
import { useState, useEffect } from 'react' 
import './index.css'
import axios from 'axios';
import { Search, Calendar as LogoIcon, Plus } from 'lucide-react'; 
import EventCard from './components/EventCard';
import CreateEventModal from './components/CreateEventModal'; 
import Header from './components/Header'

function App() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // State to control the Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Get the Base URL from the environment
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_URL = `${BASE_URL}/getevents`;

    console.log("Connecting to:", API_URL);

    axios.get(API_URL)
      .then(res => { 
        setEvents(res.data); 
        setLoading(false); 
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false); 
      });
  }, []);
  
  // Callback to update the list instantly when a new event is created
  const handleNewEvent = (newEvent) => {
    // This adds the new event to the very beginning of the array
    setEvents([newEvent, ...events]); 
  };

  // Filtering Logic
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Use the Header component and pass the 'onCreateClick' prop */}
      <Header onCreateClick={() => {
          console.log("App.jsx: Setting Modal to Open");
          setIsModalOpen(true);
      }} />

      <main className="max-w-7xl mx-auto p-8">
        {/* Search Bar */}
        <div className="relative max-w-md mb-10">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search events by name or location..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Event Grid Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
             <p className="font-medium">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-500">
                No events found matching your search.
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. The Modal Component - Hidden until isModalOpen is true */}
      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEventCreated={handleNewEvent} 
      />
    </div>
  );
}

export default App;