import Logo from "../Logo";

export const Loading = () => {
  return (
    <div
      className="
        fixed inset-0 flex flex-col items-center justify-center
        bg-primary-foreground 
      "
    >
      <div className="animate-logo-ping">
        <Logo className="text-foreground size-20" />
      </div>

      <div className="flex flex-col items-center absolute bottom-10">
        <span className="font-semibold text-blue-300 text-sm">from</span>
        <span className="text-foreground italic">huydarealest</span>
      </div>
    </div>
  );
};
