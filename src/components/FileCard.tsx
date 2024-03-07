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
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "./ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";

function FileCardActions({
  file,
  isFavourited,
}: {
  file: Doc<"files">;
  isFavourited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
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
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });
                toast({
                  variant: "default",
                  title: "File Deleted",
                  description:
                    "Your file has been permanently deleted from the system!",
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
              toggleFavorite({
                fileId: file._id,
              });
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {!isFavourited ? (
              <div className="flex gap-1 justify-center items-center text-yellow-300">
                <StarIcon className="w-4 h-4" /> <p>Favorite</p>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center text-grey-300">
                <StarHalf className="w-4 h-4" /> <p>Unfavourite</p>{" "}
              </div>
            )}
          </DropdownMenuItem>
          
          <Protect
            role="org.admin"
            fallback={
              <></>
            }
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-1 text-red-600 items-cente cursor-pointer"
              onClick={() => setIsConfirmOpen(true)}
            >
              <TrashIcon className="w-4 h-4" />
              Delete
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
        <CardTitle className="flex gap-2">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
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
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            window.open(getFileUrl(file.fileId), "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
