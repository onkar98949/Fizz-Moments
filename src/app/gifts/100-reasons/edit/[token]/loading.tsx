import { LoadingScreen } from "@/components/shared/loading-screen";

export default function HundredReasonsEditLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoadingScreen message="Counting your reasons…" />
    </div>
  );
}
