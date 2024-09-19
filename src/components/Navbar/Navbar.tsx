"use client"

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "../ui/button";



const Navbar = () => {

    const { data: session } = useSession();
    const user = session?.user as User;

    return (
        <nav className="p-4 md:p-5 shadow-md bg-[#111826]">
            <div className="container mx-auto flex flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold text-slate-200">Message~flow</Link>
                    {session && <p className="mr-4 text-slate-200 font-semibold">Welcom, {user?.username || user?.email}</p>}
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-200 text-[#111826] hover:bg-slate-300">Logout</Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="w-full md:w-auto bg-slate-200 text-[#111826] hover:bg-slate-300">Login</Button>    
                        </Link>
                    )}


                </div>
            </div>
        </nav>
    )
}

export default Navbar;