import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const Sidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col border-r border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-full transition-all">
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-stone-900">
                        <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none tracking-tight">Majmu' Admin</h1>
                        <p className="text-xs text-text-secondary dark:text-gray-400 mt-1 font-medium">v2.0.1</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 flex flex-col gap-1">
                <NavItem
                    to="/dashboard"
                    icon="dashboard"
                    label="Dashboard"
                    active={isActive('/dashboard')}
                />
                <NavItem
                    to="/bacaan"
                    icon="book_2"
                    label="Bacaan"
                    active={isActive('/bacaan')}
                />
                <NavItem
                    to="/users"
                    icon="group"
                    label="Users"
                    active={isActive('/users')}
                />
                <NavItem
                    to="/settings"
                    icon="settings"
                    label="Settings"
                    active={isActive('/settings')}
                />
                <NavItem
                    to="/logs"
                    icon="description"
                    label="Logs"
                    active={isActive('/logs')}
                />
            </div>

            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDOkcralZzay_AvO7YX_UcpksJBcUI29QkHat1UNYWuyc7Jt0W1hLZBHXselfA0YTxms8Mecg3ineZ09Rb6o86e4hVPzwLxcP9OmJG-SyITm3vul4eUWR7eD4jbwIz3WhMIDavu0X6HWn26jslT5nLyzSuaQs4e2BVDwAyPrICyP8LDVwIWC1xGnagUxQjqoo7PDNgnIM-hhng9u6GcT3figgxkUledG6oiOhEzJQn3Hp7x7lLc6q8nLMbQ58RZVKMmxiGRWLQjjeMw")' }}></div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate text-text-main dark:text-white">Admin User</p>
                        <p className="text-xs text-text-secondary dark:text-gray-400 truncate">admin@majmu.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const NavItem = ({ to, icon, label, active }: { to: string; icon: string; label: string; active?: boolean }) => {
    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                active
                    ? "bg-primary/20 text-text-main dark:text-white"
                    : "text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
        >
            <span className={clsx(
                "material-symbols-outlined",
                active
                    ? "text-stone-800 dark:text-yellow-200"
                    : "text-text-secondary group-hover:text-text-main dark:group-hover:text-gray-200"
            )}>{icon}</span>
            <span className={clsx("text-sm", active ? "font-bold" : "font-medium")}>{label}</span>
        </Link>
    );
};
