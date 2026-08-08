import type { Metadata } from "next";
import { getTemplateProjectByEditToken } from "@/database/queries/templates";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { TemplateEditor } from "@/features/editor/template-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your project — FizzMoments",
};

export default async function TemplateEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [project, userId] = await Promise.all([getTemplateProjectByEditToken(token), getCurrentUserId()]);

  if (!project) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a project for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !project.userId) {
    await claimOwnershipIfUnowned("template", project.id, userId);
    project.userId = userId;
  }

  return <TemplateEditor project={project} isSignedIn={!!userId} />;
}
