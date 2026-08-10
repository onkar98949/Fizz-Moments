import { LoadingScreen } from "@/components/shared/loading-screen";

export default function DateGeneratorEditLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoadingScreen message="Shuffling your ideas…" />
    </div>
  );
}
