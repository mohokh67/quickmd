import { useStore } from './store';
import { Toolbar, EditorContainer, Sidebar } from './components';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function App() {
  const { theme } = useStore();
  useKeyboardShortcuts();

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
