"use client";
import { formatDate } from "@/lib/utils";
import { EyeIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Author, Startup } from "@/sanity/types";
import { deleteProject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export type StartupTypeCard = Omit<Startup, "author"> & {
  author?: Author;
};

const StartupCard = ({ post, isOwner = false }: { post: StartupTypeCard; isOwner?: boolean }) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (!confirm("Are you sure you want to delete this project?")) return;

      const result = await deleteProject(post._id);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete project",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const {
    _id,
    _createdAt,
    views,
    author,
    title,
    description,
    image,
    category,
  } = post;
  
  return (
    <li className="relative max-w-sm flex flex-col bg-white/10 backdrop-blur-lg text-black dark:text-white rounded-xl border border-gray-200/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {isOwner && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      {/* Card Image */}
      <Link href={`/startup/${_id}`}>
        <div className="relative h-48 w-full">
          <Image 
            src={image ?? '/placeholder.jpg'} 
            alt={title ?? 'Project Image'} 
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-col p-5 gap-3 bg-gradient-to-b from-white/50 to-white/80 dark:from-gray-900/50 dark:to-gray-900/80">
        {/* Header - Category & Views */}
        <div className="flex justify-between items-center">
          <Link href={`/query=${category?.toLowerCase()}`}>
            <span className="text-lg uppercase font-medium text-primary hover:text-primary-dark transition-colors">
              {category}
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <EyeIcon className="h-4 w-4 text-white" />
            <span className="text-sm text-white">{views}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/startup/${_id}`}>
          <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-200 line-clamp-2">
          {description}
        </p>

        {/* Footer - Author & Date */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200/20">
          <Link href={`/user/${author?._id}`} className="flex items-center gap-2 group">
            <Image
              src={author?.image || "https://placehold.co/32x32"}
              alt={author?.name || "placeholder"}
              width={32}
              height={32}
              className="rounded-full ring-2 ring-transparent group-hover:ring-primary transition-all"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
              {author?.name}
            </span>
          </Link>
          <span className="text-xs text-gray-100">
            {formatDate(_createdAt)}
          </span>
        </div>
      </div>
    </li>
  );
};

// Add loading skeleton component
export const StartupCardSkeleton = () => {
  return (
    <li className="max-w-sm flex flex-col bg-white/10 backdrop-blur-lg rounded-xl border border-gray-200/20 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="pt-3 border-t border-gray-200/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </li>
  );
};

export default StartupCard;
