import Board from './components/Board';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="fixed top-0 left-0 right-0 bg-gray-800 shadow-md z-40">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-white">Sticky Notes Dashboard</h1>
        </div>
      </header>
      <main className="pt-14">
        <Board />
      </main>
    </div>
  );
}

export default App;
