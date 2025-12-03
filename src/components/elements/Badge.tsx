interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'gray' | 'gradient';
  size?: 'sm' | 'md';
}

export const Badge = ({ children, variant = 'blue', size = 'md' }: BadgeProps) => {
  const variants = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    gray: 'bg-slate-100 text-slate-700',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
