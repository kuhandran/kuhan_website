interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 mx-auto mb-4 text-blue-500">
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
};