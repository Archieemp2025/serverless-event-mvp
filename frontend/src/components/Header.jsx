export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
      <h1 className="text-2xl font-bold text-purple-700">EventHub</h1>
      <button className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">
        + Create Event
      </button>
    </header>
  );
}