import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";

// Enable experimental React Server Components feature
export const experimental_ppr = true;

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params; // Extract `id` from params
  const session = await auth(); // Fetch user session

  // Fetch user data by ID
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  const isCurrentUser = session?.id === id;

  return (
    <section className="flex flex-col lg:flex-row gap-10 p-8 lg:p-16 bg-gray-50">
  {/* User Profile */}
  <div className="profile-card flex flex-col items-center lg:items-start bg-white shadow-md rounded-lg p-8">
    <Image
      src={user.image}
      alt={user.name}
      width={150}
      height={150}
      className="rounded-full border border-gray-200"
    />
    <h1 className="text-2xl font-bold text-gray-800 mt-5">{user.name}</h1>
    <p className="text-sm text-gray-500">@{user.username}</p>
    <p className="text-center lg:text-left text-gray-600 mt-4">{user.bio}</p>
  </div>

  {/* Startups Section */}
  <div className="flex-1">
    <h2 className="text-xl font-semibold text-gray-800 mb-6">
      {isCurrentUser ? "Your" : `${user.name}'s`} Projects
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Suspense fallback={<StartupCardSkeleton />}>
        <UserStartups id={id} />
      </Suspense>
    </div>
  </div>
</section>

  );
};

export default Page;
