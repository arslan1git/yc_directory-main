
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import StartupForm from "@/components/StartupForm";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 mb-10">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_500px_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Create Something Amazing</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-50 to-indigo-100">
              Share Your Vision With The World
            </h1>
            
            <p className="text-lg md:text-xl text-indigo-100/90 max-w-2xl mx-auto">
              Turn your innovative ideas into reality. Join our community of creators and get the visibility your project deserves.
            </p>
          </div>
        </div>
      </section>

      < StartupForm />
    </>
  );
};

export default Page;