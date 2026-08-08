import { LoadingScreen } from "@/components/shared/loading-screen";

export default function TemplateStoryLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoadingScreen message="Preparing your surprise…" />
    </div>
  );
}
