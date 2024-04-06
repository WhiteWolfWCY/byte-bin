"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "../components/UploadButton";
import { FileCard } from "../components/FileCard";
import Image from "next/image";
import {
  GridIcon,
  Loader2,
  RowsIcon,
  TableIcon,
  UploadIcon,
} from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { useState } from "react";
import { DataTable } from "./FileTable";
import { columns } from "./Columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../convex/_generated/dataModel";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl flex gap-4">
        You have no files, upload one now
        <UploadButton />
      </div>
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
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

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
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favouritesOnly,
          deletedOnly,
        }
      : "skip"
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
      <div className="flex gap-2 flex-row items-center mb-8">
        <h1 className="text-4xl font-bold text-nowrap">{title}</h1>
        <UploadButton />
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger className="flex gap-2 items-center" value="grid">
              <GridIcon className="w-6 h-6 mr-1" />
              <p className="text-lg">Tiles</p>
            </TabsTrigger>
            <TabsTrigger className="flex gap-2 items-center" value="table">
              <RowsIcon className="w-6 h-6 mr-1" />
              <p className="text-lg">Table</p>
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
          {modifiedFiles.length !== 0 ? (
            <DataTable columns={columns} data={modifiedFiles} />
          ) : null}
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder />}
    </div>
  );
}
