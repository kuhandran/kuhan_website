interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = ({ subtitle, title, description, align = 'center' }: SectionHeaderProps) => {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const containerClass = align === 'center' ? 'mx-auto' : '';
  
  return (
    <div className={`max-w-3xl ${containerClass} mb-12 ${alignClass}`}>
      {subtitle && (
        <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-slate-600">
          {description}
        </p>
      )}
      <div className={`w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mt-6 ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
};

