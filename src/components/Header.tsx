import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header () {
    return <div className="relative z-10 border-b py-4 bg-gray-50">
        <div className="container mx-auto justify-between flex flex-row items-center">
                <Link href='/' className="flex gap-2 items-center text-xl text-black">
                <Image src='/logo_white.png' width='80' height='80' alt='ByteBin logo' className="w-16 h-16" />
                ByteBin
                </Link>
            
            <div className="flex gap-2">
                <OrganizationSwitcher />
                <UserButton />
                <SignedOut>
                    <SignInButton>
                        <Button>
                            Sign In
                        </Button>
                    </SignInButton>
                </SignedOut>
                
            </div>
        </div>
    </div>

}