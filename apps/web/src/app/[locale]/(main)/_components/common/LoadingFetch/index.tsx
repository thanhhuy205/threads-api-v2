import { Spinner } from "@/components/ui/shadcn-io/spinner";

const LoadingFetch = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <Spinner className="-translate-y-1/2" />
    </div>
  );
};

export default LoadingFetch;
