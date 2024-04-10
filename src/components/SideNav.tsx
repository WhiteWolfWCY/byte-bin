"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideNavProps {
  inSideMenu: boolean,
  onClose?: () => void;
}

export function SideNav( {inSideMenu, onClose} : SideNavProps ) {
  const pathname = usePathname();

  return (
    <div className={`${inSideMenu ? "flex text-8xl gap-12 w-full items-center mt-12" : "hidden md:flex gap-4 w-40"} flex-col`}>
      <Link href="/dashboard/files">
        <Button
          variant={"link"}
          onClick={onClose}
          className={clsx("flex gap-2", {
            "text-foreground": pathname.includes("/dashboard/files"),
          })}
        >
          {inSideMenu ? 
          <p className="flex flex-row items-center gap-2 text-4xl"><FileIcon className="w-10 h-10" /> All Files</p>
          :
          <><FileIcon /> All Files</>
          }
          
        </Button>
      </Link>

      <Link href="/dashboard/favourites">
        <Button
          variant={"link"}
          onClick={onClose}
          className={clsx("flex gap-2", {
            "text-foreground": pathname.includes("/dashboard/favourites"),
          })}
        >
          {inSideMenu ? 
          <p className="flex flex-row items-center gap-2 text-4xl"><StarIcon className="w-10 h-10" /> Favourites</p>
          :
          <><StarIcon /> Favourites</>
          }
          
        </Button>
      </Link>

      <Link href="/dashboard/trash">
        <Button
          variant={"link"}
          onClick={onClose}
          className={clsx("flex gap-2", {
            "text-foreground": pathname.includes("/dashboard/trash"),
          })}
        >
          {inSideMenu ? 
          <p className="flex flex-row items-center gap-2 text-4xl"><TrashIcon className="w-10 h-10" /> Trash</p>
          :
          <><TrashIcon /> Trash</>
          }
          
        </Button>
      </Link>
    </div>
  );
}
