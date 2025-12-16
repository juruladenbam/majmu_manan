import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-text-light">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
                <Navbar />
                <div className="flex-1 overflow-y-auto p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
