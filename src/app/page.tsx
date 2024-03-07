"use client";

import { FileCard } from "@/components/FileCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { FileIcon, Loader2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "../components/UploadButton";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      <Image
        alt="Image of an empty container"
        width="400"
        height="400"
        src="/empty.svg"
      />
      <p className="text-2xl text-muted-foreground mt-1">
        You don&apos;t have any files yet. Upload your first file now!
      </p>
      <UploadButton />
    </div>
  );
}

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : "skip");

  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-8">
        <div className="w-40 flex-col gap-4">
          <Link href="/dashboard/files">
            <Button variant={'link'} className="flex gap-2">
              <FileIcon className="w-6 h-6" /> All Files
            </Button>
          </Link>
          <Link href="/dashboard/favourites">
            <Button variant={'link'} className="flex gap-2">
              <Star className="w-6 h-6" /> Favourites
            </Button>
          </Link>
        </div>

        <div className="w-full">
          {files === undefined && (
            <div className="flex flex-col gap-4 w-full items-center mt-24 text-primary">
              <Loader2 className="w-32 h-32 animate-spin" />
              <p>Loading...</p>
            </div>
          )}

          {files && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Your files</h1>
                <SearchBar query={query} setQuery={setQuery} />
                <UploadButton />
              </div>

              {files.length === 0 && <Placeholder />}

              <div className="grid grid-cols-3 gap-4">
                
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
