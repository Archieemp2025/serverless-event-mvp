import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import './index.css'

import { useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar as LogoIcon } from 'lucide-react'; // Renamed for logo
import EventCard from './components/EventCard';


function App() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const API_URL = "https://event-api-wic-czdvc8bwfsb7drag.australiaeast-01.azurewebsites.net/api/getevents";
  //   axios.get(API_URL)
  //     .then(res => { setEvents(res.data); setLoading(false); })
  //     .catch(() => setLoading(false));
  // }, []);
  
  useEffect(() => {
    // 1. Get the Base URL from the environment
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    // 2. Combine it with the specific function name
    const API_URL = `${BASE_URL}/getevents`;

    console.log("Connecting to:", API_URL); // Useful for debugging!

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
  
  // Filtering Logic
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Figma Header */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <LogoIcon size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Evently MVP</h1>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Create Event
        </button>
      </header>

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

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 font-medium">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;