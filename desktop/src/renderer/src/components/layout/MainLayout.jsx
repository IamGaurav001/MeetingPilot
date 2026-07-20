import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const layoutStyles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    padding: 'var(--spacing-xl)',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default function MainLayout() {
  return (
    <div style={layoutStyles.container}>
      <Sidebar />
      <div style={layoutStyles.main}>
        <Header />
        <main style={layoutStyles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
