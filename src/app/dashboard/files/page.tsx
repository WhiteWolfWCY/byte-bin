import { FileBrowser } from "../../../components/FileBrowser";

export default function FilesPage() {
  return (
    <div className="pb-24">
      <FileBrowser title="Your Files" deletedOnly={false} />
    </div>
  );
}