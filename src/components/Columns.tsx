"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../convex/_generated/dataModel";

import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FileCardActions } from "./FileActions";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });

  return (
    <div className="flex gap-2 text-xs text-muted-foreground items-center">
      <Avatar className="h-6 w-6 text-[12px]">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>{userProfile?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}

export const columns: ColumnDef<Doc<"files"> & { isFavourited: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
    header: "User",
  },
  {
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("createdOn"));

      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      );
    },
    header: "Uploaded On",
  },
  {
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("createdOn"));

      return (
        <div>
          <FileCardActions
            file={row.original}
            isFavourited={row.original.isFavourited}
          />
        </div>
      );
    },
    header: "Actions",
  },
];
