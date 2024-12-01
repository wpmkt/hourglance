import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

const Card = ({ title, children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-neutral-200 shadow-sm",
        className
      )}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};

export default Card;