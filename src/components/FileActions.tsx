    import { Doc, Id } from "../../convex/_generated/dataModel";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
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
  } from "@/components/ui/alert-dialog";
  import { useState } from "react";
  import { useMutation } from "convex/react";
  import { api } from "../../convex/_generated/api";
  import { useToast } from "./ui/use-toast";
  import { Protect } from "@clerk/nextjs";

  export function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
  }
  
  export function FileCardActions({
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