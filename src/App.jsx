import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import Board from './components/Board';
import LandingPage from './components/LandingPage';
import { PencilIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { getDashboardSettings, updateDashboardTitle } from './services/dashboardService';

function App() {
  const [title, setTitle] = useState('Sticky Notes Dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getDashboardSettings();
        setTitle(settings.title);
      } catch (error) {
        console.error('Error fetching dashboard settings:', error);
      }
    };

    if (user) {
      fetchSettings();
    }
  }, [user]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleSubmit = async () => {
    setIsEditing(false);
    try {
      await updateDashboardTitle(title);
    } catch (error) {
      console.error('Error updating dashboard title:', error);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      // Fetch the current title from the server
      getDashboardSettings().then(settings => setTitle(settings.title));
    }
  };

  const handleForceSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-100 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <LandingPage />
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
                      onKeyDown={handleTitleKeyDown}
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
                  <span className="text-neutral-400 text-sm">
                    {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                  </span>
                  <button
                    onClick={handleForceSignOut}
                    className="p-2 text-red-400/70 hover:text-red-400 transition-colors rounded-full hover:bg-neutral-700/50"
                    title="Force Sign Out"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
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
