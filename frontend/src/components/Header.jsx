// export default function Header() {
//   return (
//     <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
//       <h1 className="text-2xl font-bold text-purple-700">EventHub</h1>
//       <button className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">
//         + Create Event
//       </button>
//     </header>
//   );
// }


// Header.jsx
// export default function Header({ onCreateClick }) { // 1. Accept the prop here
//   return (
//     <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
//       <h1 className="text-2xl font-bold text-purple-700">Evently MVP</h1>
//       <button 
//         onClick={onCreateClick} // 2. Trigger the function on click
//         className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all"
//       >
//         + Create Event
//       </button>
//     </header>
//   );
// }

export default function Header({ onCreateClick }) { 
  return (
    <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Evently MVP</h1>
      </div>

      <button 
        onClick={onCreateClick} // This MUST match the prop name in App.jsx
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all cursor-pointer relative z-50"
      >
        + Create Event
      </button>
    </header>
  );
}