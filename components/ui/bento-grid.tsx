import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:grid-cols-3 gap-6 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento rounded-3xl hover:shadow-2xl transition duration-300 shadow-sm bg-white border border-slate-100 flex flex-col overflow-hidden",
        className
      )}
    >
      {header}
      <div className="p-8 flex flex-col flex-grow group-hover/bento:translate-x-2 transition duration-300">
        {icon && (
          <div className="p-3 bg-[#00b4d8]/10 rounded-2xl w-fit mb-4">
            {icon}
          </div>
        )}
        <div className="font-sans font-black text-[#0a1128] text-2xl mb-3">
          {title}
        </div>
        <div className="font-sans font-normal text-slate-500 text-sm leading-relaxed flex-grow">
          {description}
        </div>
      </div>
    </div>
  );
};
