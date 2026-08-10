import type { Metadata } from "next";
import { getTemplateProjectById } from "@/database/queries/templates";
import { InvalidLink } from "@/components/shared/invalid-link";
import { TemplatePlayer } from "@/components/shared/template-player";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getTemplateProjectById(id);

  if (!project) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: project.title,
    description: "A personal surprise made with FizzMoments.",
    path: `/templates/story/${id}`,
    noindex: true,
  });
}

export default async function TemplateStoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const project = await getTemplateProjectById(id);

  if (!project) {
    return (
      <InvalidLink
        title="This surprise couldn't be found"
        description="The link might be mistyped, or the project may no longer exist."
      />
    );
  }

  return (
    <div className="bg-secondary flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
      <TemplatePlayer project={project} />
    </div>
  );
}
