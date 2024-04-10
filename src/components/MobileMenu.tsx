"use client"
import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { SideNav } from "./SideNav";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  themeName: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  themeName,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full bg-accent opacity-95 z-20 shadow-lg transform transition-transform duration-1000 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center w-full py-4 h-[98px]">
        <Button variant={"ghost"} onClick={onClose}>
          <X className={`transform transition-transform duration-1000 ${!isOpen ? "rotate-0" : "rotate-[360deg]"}`} />
        </Button>
      </div>
      <div className="flex h-full justify-center">
        <SideNav inSideMenu onClose={onClose}/>  
      {/* Stopka menu */}
      <div className="absolute bottom-0 left-0 h-20 w-full bg-accent py-4 shadow-top">
        <div className="flex gap-8 items-center justify-center">
          <OrganizationSwitcher
            appearance={{
              baseTheme: themeName === "dark" ? dark : undefined,
            }}
          />
          <UserButton
            appearance={{
              baseTheme: themeName === "dark" ? dark : undefined,
            }}
          />
        </div>
        <div className="flex justify-center">
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MobileMenu;
