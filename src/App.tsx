import { useEffect } from 'react';
import { useStore } from './store';
import { Toolbar, EditorContainer, Sidebar } from './components';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { storeGet } from './native';
import './App.css';

function App() {
  const { theme, setTheme } = useStore();
  useKeyboardShortcuts();

  useEffect(() => {
    storeGet('ui.theme').then((stored) => {
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    }).catch(console.error);
  }, []);

  return (
    <div className={`app ${theme}`}>
      <Toolbar />
      <div className="main-area">
        <Sidebar />
        <div className="main-content">
          <EditorContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
