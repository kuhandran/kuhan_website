interface TechTagProps {
  name: string;
  icon?: React.ReactNode;
}

export const TechTag = ({ name, icon }: TechTagProps) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
      {icon && <span className="w-4 h-4">{icon}</span>}
      {name}
    </span>
  );
};