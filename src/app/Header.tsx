import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header () {
    return <div className="border-b py-4 bg-gray-50">
        <div className="container mx-auto justify-between flex items-center">
            <div>
                ByteBin
            </div>
            <div className="flex gap-8">
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