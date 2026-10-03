import ColumnClient from "@/app/[locale]/(main)/(default)/_components/ContentClient";
import HeaderMobile from "../HeaderMobile";

interface ContentProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function Content({ children, isAuthenticated: _ }: ContentProps) {
  return (
    <main className="flex-1 min-w-0 h-full text-foreground">
      <HeaderMobile />

      <div className="mt-[24px] md:mt-0 h-full">
        <ColumnClient>{children}</ColumnClient>
      </div>
    </main>
  );
}
