import clsx from "clsx";

interface NavItemProps {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  badge?: string | number;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  className,
  badge,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      title={label}
      className={clsx(
        "relative flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium transition-colors lg:justify-start",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold before:absolute before:-left-2 before:top-1/2 before:h-[18px] before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-sidebar-primary lg:before:-left-3"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className,
      )}
    >
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      {label ? (
        <span className="hidden min-w-0 flex-1 truncate leading-tight lg:block">
          {label}
        </span>
      ) : null}
      {badge !== undefined ? (
        <span className="hidden min-w-[17px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-[17px] text-destructive-foreground lg:inline-flex">
          {badge}
        </span>
      ) : null}
    </button>
  );
};

export default NavItem;
