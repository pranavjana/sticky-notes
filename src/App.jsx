import { useState } from 'react';
import { SignIn, SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import Board from './components/Board';
import { PencilIcon } from '@heroicons/react/24/outline';

function App() {
  const [title, setTitle] = useState('Sticky Notes Dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    setIsEditing(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-100 text-xl">Loading...</div>
      </div>
    );
  }

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || 'No email';

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
          <div className="w-full max-w-md px-4">
            <SignIn />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-neutral-900">
          <header className="fixed top-0 left-0 right-0 bg-neutral-800 shadow-lg border-b border-neutral-700 z-40">
            <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between relative">
                <div className="flex items-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                      onBlur={handleTitleSubmit}
                      onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                      autoFocus
                      className="text-xl font-bold text-neutral-100 bg-neutral-700 px-2 py-1 rounded outline-none w-auto"
                    />
                  ) : (
                    <h1 className="text-xl font-bold text-neutral-100">{title}</h1>
                  )}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="ml-2 p-1 text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400">
                    {userEmail}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="pt-14">
            <Board />
          </main>
        </div>
      </SignedIn>
    </>
  );
}

export default App;
