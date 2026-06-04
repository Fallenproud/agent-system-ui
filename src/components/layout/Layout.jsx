import TopBar from './TopBar';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

export default function Layout({ activeView, onNavigate, children, showTopBar, onDismissTopBar }) {
  return (
    <div className="app">
      {showTopBar && <TopBar onDismiss={onDismissTopBar} />}
      <div className="app-body">
        <Sidebar activeView={activeView} onNavigate={onNavigate} />
        <main className="main-area">
          {children}
        </main>
        <RightPanel view={activeView} />
      </div>
    </div>
  );
}
