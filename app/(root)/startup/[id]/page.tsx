import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
  {/* Header Section */}
  <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-32 overflow-hidden rounded-lg">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute -left-20 -top-20 w-72 h-72 bg-white rounded-full animate-pulse"></div>
      <div className="absolute right-10 bottom-10 w-96 h-96 bg-white rounded-full animate-pulse"></div>
    </div>

    <div className="relative text-center space-y-8 max-w-5xl mx-auto px-4">
      <p className="text-xl text-blue-100">{formatDate(post?._createdAt)}</p>

      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 transition-all duration-300 hover:text-blue-50">
        {post.title}
      </h1>

      <p className="text-xl md:text-2xl max-w-6xl mx-auto text-blue-50/90 leading-relaxed opacity-80">
        {post.description}
      </p>
    </div>
  </section>

  {/* Content Section */}
  <section className="relative max-w-7xl mx-auto px-4 py-12 bg-white shadow-lg rounded-lg mt-12">
    {/* Main Image */}
    <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
      <img
        src={post.image}
        alt="thumbnail"
        className="w-full h-auto object-cover"
      />
    </div>

    {/* Author and Metadata */}
    <div className="space-y-5 mt-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center gap-5">
        <Link
          href={`/user/${post.author?._id}`}
          className="flex gap-3 items-center"
        >
          <Image
            src={post.author.image}
            alt="avatar"
            width={64}
            height={64}
            className="rounded-full border-4 border-white shadow-md transition-transform duration-300 hover:scale-105"
          />
          <div>
            <p className="text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors">
              {post.author.name}
            </p>
            <p className="text-sm text-gray-600">@{post.author.username}</p>
          </div>
        </Link>

        <p className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-lg">
          {post.category}
        </p>
      </div>

      {/* Pitch Details */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Pitch Details
        </h3>
        {parsedContent ? (
          <article
            className="prose max-w-4xl font-sans text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p className="text-gray-500">No details provided.</p>
        )}
      </div>
    </div>

    {/* Divider */}
    <hr className="divider my-10" />

    {/* View Button */}
    <div className="mt-12 flex justify-center">
      <Suspense fallback={<Skeleton className="w-full h-12 bg-gray-200 rounded-lg" />}>
        <View id={id} />
      </Suspense>
    </div>
  </section>
</>

  );
};

export default Page;
