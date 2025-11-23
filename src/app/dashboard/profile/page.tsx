import Layout from "@/components/layout";
import { getUserProfile } from "@/app/actions/profile";
import ProfileView from "@/components/profile/profile-view";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const result = await getUserProfile();

  if (!result.success || !result.profile) {
    redirect("/auth/sign-in");
  }

  return (
    <Layout>
      <ProfileView profile={result.profile} />
    </Layout>
  );
}
