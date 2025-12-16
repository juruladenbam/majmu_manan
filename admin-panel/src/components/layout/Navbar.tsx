

export const Navbar = () => {
    return (
        <header className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400">
                    <span className="hover:text-text-main dark:hover:text-gray-200 cursor-pointer">Admin</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="font-medium text-text-main dark:text-white">Dashboard</span>
                </div>
            </div>

            <div className="flex flex-1 justify-end gap-6">
                <div className="relative w-full max-w-md hidden sm:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-xl border-none bg-surface-accent dark:bg-gray-800 py-2.5 pl-10 pr-4 text-text-main dark:text-white placeholder:text-text-secondary focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                        placeholder="Search..."
                    />
                </div>

                <button className="relative rounded-full p-2 text-text-secondary hover:text-text-main dark:hover:text-gray-200 transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                </button>
            </div>
        </header>
    );
};
