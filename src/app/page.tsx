import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl ">
          <div className="text-center">
            <Image
              height="300"
              width="300"
              alt="byte bin"
              src="/logo_white.png"
              className="inline-block"
            />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Share your files with anyone you want <span className="text-blue-600">the easiest</span> way possible
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Make an account and start managing your files in seconds!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard/files">
                <Button>Get started</Button>
              </Link>
              <Link
                href="/dashboard/files"
                className="text-sm font-semibold leading-6 text-gray-900 hover:underline hover:text-blue-500"
              >
                <Button variant={'ghost'}>
                  Learn more &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
