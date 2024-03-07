"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "../components/UploadButton";
import { FileCard } from "../components/FileCard";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon, TableIcon } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { useState } from "react";
import { DataTable } from "./FileTable";
import { columns } from "./Columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({
  title,
  favouritesOnly,
  deletedOnly,
}: {
  title: string;
  favouritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favourites = useQuery(
    api.files.getAllFavourites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favouritesOnly, deletedOnly } : "skip"
  );
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavourited: (favourites ?? []).some(
        (favourite) => favourite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>

            <SearchBar query={query} setQuery={setQuery} />

            <UploadButton />
          </div>

          <Tabs defaultValue="grid">
            <TabsList className="w-full mb-4">
              <TabsTrigger
                className="flex items-center w-full mr-1 border-1 border-solid border-gray-200"
                value="grid"
              >
                <GridIcon className="w-6 h-6 mr-1" />
                <p className="text-lg">Tiles</p>
              </TabsTrigger>
              <TabsTrigger
                className="flex items-center w-full border-1 border-solid border-gray-200"
                value="table"
              >
                <RowsIcon className="w-6 h-6 mr-1" />
                <p className="text-lg">Table</p>
              </TabsTrigger>
            </TabsList>
            {isLoading && (
              <div className="flex flex-col gap-8 w-full items-center mt-24">
                <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
                <div className="text-2xl">Loading your files...</div>
              </div>
            )}
            <TabsContent value="grid">
              <div className="grid grid-cols-3 gap-4">
                {modifiedFiles?.map((file) => {
                  return <FileCard key={file._id} file={file} />;
                })}
              </div>
            </TabsContent>
            <TabsContent value="table">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>

          {files?.length === 0 && <Placeholder />}
    </div>
  );
}
