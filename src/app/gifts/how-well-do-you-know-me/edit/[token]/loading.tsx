import { LoadingScreen } from "@/components/shared/loading-screen";

export default function QuizEditLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoadingScreen message="Opening your quiz…" />
    </div>
  );
}
