import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const session = await auth();

  console.log(session?.id);

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  // const posts =[{
  //   createdAt: new Date(),
  //   view: 100,
  //   author: { _id: 1, name: 'Adnan'},
  //   _id: 1,
  //   description: 'A responsive personal portfolio showcasing projects, blog posts, and a contact form.',
  //   title: 'Personal Portfolio Website',
  //   category: 'Portfolio',
  //   image: 'https://files.oaiusercontent.com/file-XkZiK3YdxEfBJ7ip8jcUdm?se=2024-11-29T13%3A05%3A35Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dddfd325d-0afb-44d1-ba77-317f52e6d164.webp&sig=QaqgjJwQq/TGJN3H5mZjJ5YhvCOz3BfQlwJDdQTWDYE%3D'
  // }]

  return (
    <>
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute right-10 bottom-10 w-96 h-96 bg-white rounded-full"></div>
        </div>

        <div className="relative text-center space-y-8 max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Showcase Your Code,
            <span className="block">Build Your Future</span>
          </h1>

          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-blue-50/90 leading-relaxed">
            Join our community of developers, share your innovative projects,
            and connect with fellow coders who are shaping the future of
            technology.
          </p>

          <div className="mt-8">
            <SearchForm query={query} />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-2xl font-semibold text-white mb-6">
          {query ? `Search results for "${query}"` : "All Projects"}
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard 
                key={post?._id} 
                post={post} 
                isOwner={session?.id === post.author?._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-lg col-span-full text-center py-12">
              No projects found. Be the first to share your project!
            </p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
