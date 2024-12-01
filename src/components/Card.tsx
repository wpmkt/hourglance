import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card = ({ title, children, className, noPadding = false, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        </div>
      )}
      <div className={cn(noPadding ? "" : "p-6")}>{children}</div>
    </div>
  );
};

export default Card;