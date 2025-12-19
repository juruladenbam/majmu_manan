interface StatCardProps {
  icon: string;
  value: number;
  label: string;
  sublabel?: string;
}

export const StatCard = ({ icon, value, label, sublabel }: StatCardProps) => (
  <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className="size-12 rounded-lg bg-surface-accent dark:bg-surface-accent-dark flex items-center justify-center mb-3">
      <span className="material-symbols-outlined text-primary-dark dark:text-primary text-2xl">
        {icon}
      </span>
    </div>
    <div className="text-3xl font-bold text-text-dark dark:text-white mb-1">
      {value.toLocaleString()}
    </div>
    <div className="text-sm text-text-secondary dark:text-gray-400">{label}</div>
    {sublabel && (
      <div className="text-xs text-text-secondary/70 dark:text-gray-500 mt-1">{sublabel}</div>
    )}
  </div>
);
