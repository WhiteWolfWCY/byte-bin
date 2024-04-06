import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <div className="relative hidden md:flex z-10 h-20 bg-headerfooter border-t items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Image
            width="100"
            height="100"
            alt="byte bin"
            src="/logo_white.png"
            className="h-8 w-8"
          />
          <p className="text-foreground">ByteBin &copy;</p>
        </div>
        <div className="">
        <Link href="/privacy">
          <Button variant={"link"}>Privacy Policy</Button>
        </Link>
        <Link href="/terms-of-service">
          <Button variant={"link"}>Terms of Service</Button>
        </Link>
        <Link href="/about">
          <Button variant={"link"}>About</Button>
        </Link>
        </div>
        
      </div>
    </div>
  );
}
