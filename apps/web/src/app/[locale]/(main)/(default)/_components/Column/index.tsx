import { useState, type ReactNode } from "react";

const Column = ({
  id,
  pathName,
  children,
}: {
  id?: number;
  pathName?: string;
  children: ReactNode;
  textHeader?: string;
}) => {
  const [isAnimating, setIsAnimating] = useState(pathName !== "/");

  if (!id) {
    const isHome = pathName === "/";
    const isPulseBoardPage =
      pathName === "/activity" ||
      pathName === "/growth" ||
      pathName?.startsWith("/profile");

    return (
      <div
        className={
          isHome || isPulseBoardPage ? "min-h-full bg-background" : ""
        }
      >
        {/* Nếu là settings thì thay đổi độ rộng của column */}
        <div
          className={`relative z-2 flex-1 ${
            isHome || isPulseBoardPage
              ? "bg-background shadow-none"
              : "bg-white shadow-sm md:rounded-tl-2xl md:rounded-tr-2xl dark:bg-card"
          } ${
            pathName?.startsWith("/settings/") ? "settings-page !pt-0" : ""
          }`}
        >
          <div
            className={
              isHome || isPulseBoardPage
                ? "h-full min-h-screen"
                : "h-full min-h-screen md:px-5 md:pt-5 md:pb-8"
            }
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <div
      className="column"
      style={{
        animation: isAnimating
          ? "col-enter 200ms cubic-bezier(.22,.9,.27,1) both"
          : undefined,
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="column-container relative z-2 flex-1 bg-white shadow-sm md:rounded-tl-2xl md:rounded-tr-2xl dark:bg-card">
        <div className="md:px-5 md:pt-5 md:pb-8">{children}</div>
      </div>
    </div>
  );
};

export default Column;
