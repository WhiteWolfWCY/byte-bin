"use client";

import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { dark, shadesOfPurple } from "@clerk/themes";

export function Header() {
  const { setTheme } = useTheme();
  const [themeName, setThemeName] = useState("light");

  return (
    <div className="relative z-10 border-b py-4 bg-headerfooter">
      <div className="container mx-auto justify-between flex flex-row items-center">
        <Link href="/" className="flex gap-2 items-center text-xl text-black">
          <Image
            src="/logo_white.png"
            width="80"
            height="80"
            alt="ByteBin logo"
            className="w-16 h-16"
          />
          <h1 className="text-2xl font-semibold text-foreground">ByteBin</h1>
        </Link>

        <div className="flex gap-2 items-center justify-center">
          {themeName === "light" ? (
            <Button
              variant={"ghost"}
              onClick={() => {
                setTheme("dark");
                setThemeName("dark");
              }}
            >
              <MoonIcon />
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              onClick={() => {
                setTheme("light");
                setThemeName("light");
              }}
            >
              <SunIcon />
            </Button>
          )}
          <div className="flex items-center justify-center">
            <OrganizationSwitcher
              appearance={{
                baseTheme: themeName === "dark" ? dark : undefined,
              }}
            />
          </div>
          <UserButton
            appearance={{ baseTheme: themeName === "dark" ? dark : undefined }}
          />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
