"use client";

import { FileCard } from "@/components/FileCard";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "../components/UploadButton";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto pt-12">
      {files === undefined && (
        <div className="flex flex-col gap-4 w-full items-center mt-24 text-primary">
          <Loader2 className="w-32 h-32 animate-spin" />
          <p>Loading...</p>
        </div>
      )}

      {files && files.length === 0 && (
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
      )}

      {files && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your files</h1>
            <UploadButton />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}
