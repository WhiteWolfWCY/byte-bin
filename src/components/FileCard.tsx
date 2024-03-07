import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { formatRelative, subDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  TrashIcon,
  StarIcon,
  StarHalf,
  UndoIcon,
  DownloadIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "./ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function FileCardActions({
  file,
  isFavourited,
}: {
  file: Doc<"files">;
  isFavourited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for deletion. Files are being
              deleted periodically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });
                toast({
                  variant: "default",
                  title: "File marked for deletion",
                  description:
                    "Your file has been moved to trash, and will be deleted with the next scheduled deletion!",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open(getFileUrl(file.fileId), "_blank");
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({
                fileId: file._id,
              });
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {!isFavourited ? (
              <div className="flex gap-1 justify-center items-center text-yellow-300">
                <StarIcon className="w-4 h-4" /> <p>Favourite</p>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center text-grey-300">
                <StarHalf className="w-4 h-4" /> <p>Unfavourite</p>{" "}
              </div>
            )}
          </DropdownMenuItem>

          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-1 items-cente cursor-pointer"
              onClick={() => {
                if (file.markForDeletion) {
                  restoreFile({
                    fileId: file._id,
                  });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
            >
              {file.markForDeletion ? (
                <div className="flex gap-1 text-green-600 items-cente cursor-pointer">
                  <UndoIcon className="w-4 h-4" />
                  Restore
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-cente cursor-pointer">
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export function FileCard({
  file,
  favourites,
}: {
  file: Doc<"files">;
  favourites: Doc<"favorites">[];
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const isFavourited = favourites.some(
    (favourite) => favourite.fileId === file._id
  );

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          {file.name.length > 15 ? file.name.substring(0, 15) : file.name}
        </CardTitle>
        <div className="absolute top-2 right-3">
          <FileCardActions isFavourited={isFavourited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && (
          <Image
            alt={file.name}
            width="100"
            height="100"
            src={getFileUrl(file.fileId)}
            className="w-full h-full"
            style={{ objectFit: "contain" }}
          />
        )}
        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-muted-foreground items-center">
          <Avatar className="h-6 w-6 text-[12px]">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>{userProfile?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-muted-foreground">
          Uploaded on:{" "}
          {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
