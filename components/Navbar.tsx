import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-gradient-to-r from-black/90 to-gray-900/90 dark:from-black/90 dark:to-gray-900/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200/20 dark:border-gray-700/20 supports-[backdrop-filter]:bg-black/90">
      <div className="container mx-auto px-4 max-w-8xl">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 transition-all hover:opacity-80 group">
            <Image 
              src="/Code.png" 
              alt="logo" 
              width={40} 
              height={40} 
              className="rounded-full object-contain transition-transform group-hover:scale-105" 
            />
            <span className="text-white font-semibold text-lg underline underline-offset-4 decoration-transparent hover:decoration-white transition-colors">
              Student Showcase
            </span>
          </Link>

          <div className="flex items-center gap-5 text-gray-700 dark:text-gray-200">
            {session && session?.user ? (
              <>
                <Link 
                  href="/startup/create"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90 text-white transition-all"
                >
                  <BadgePlus className="size-5" />
                  <span className="max-sm:hidden">Create</span>
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-400 hover:opacity-90 text-white transition-all"
                  >
                    <LogOut className="size-5" />
                    <span className="max-sm:hidden">Logout</span>
                  </button>
                </form>

                <Link href={`/user/${session?.id}`}>
                  <Avatar className="size-10 ring-2 ring-transparent hover:ring-primary transition-all">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
                      AV
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              </form>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;