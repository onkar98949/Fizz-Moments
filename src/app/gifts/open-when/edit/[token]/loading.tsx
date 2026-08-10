import { LoadingScreen } from "@/components/shared/loading-screen";

export default function OpenWhenEditLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoadingScreen message="Gathering your letters…" />
    </div>
  );
}
