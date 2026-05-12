import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto animate-fadeInUp">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
