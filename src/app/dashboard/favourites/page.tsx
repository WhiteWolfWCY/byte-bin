"use client";

import { FileBrowser } from "../../../components/FileBrowser";

export default function FavoritesPage() {
  return (
    <div className="pb-24">
      <FileBrowser title="Favorites" favouritesOnly />
    </div>
  );
}