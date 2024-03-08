"use client";

import { FileBrowser } from "../../../components/FileBrowser";

export default function TrashPage() {
  return (
    <div className="pb-24">
      <FileBrowser title="Trash" deletedOnly />
    </div>
  );
}