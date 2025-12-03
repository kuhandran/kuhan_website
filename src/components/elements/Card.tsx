interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = true }: CardProps) => {
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};