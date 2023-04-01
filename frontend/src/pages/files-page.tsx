import { ImFileEmpty } from "react-icons/im";
import { NavLink, useParams } from "react-router-dom";
import { useFile } from "../hooks/useFile";
import { useScript } from "../hooks/useScript";
import { files } from "../data/files";

import Navbar from "../components/navbar";
import { IFile } from "../types/types";

const FileField = ({ field, value }: { field: string; value: string }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <p className="opacity-50">{field}</p>
      <p>{value}</p>
    </div>
  );
};

const File = ({ file }: { file: IFile }) => {
  const icon = <ImFileEmpty className="" size={100} />;

  return (
    <NavLink
      to={`/storage/${file.id}`}
      className={({ isActive }) =>
        isActive
          ? "rounded-md bg-white w-full aspect-square border-2 border-blue-500 transition-all"
          : "rounded-md bg-white w-full aspect-square"
      }
    >
      <div className="h-full flex flex-col items-center justify-center">
        {icon}
        <p className="mt-3">{file.filename}</p>
        <p className="opacity-50 text-[14px]">
          {file.date} - {file.size}
        </p>
      </div>
    </NavLink>
  );
};

const FileInfo = ({ file }: { file: IFile | undefined }) => {
  if (file === undefined)
    return <div>Oops something went wrong with the file...</div>;

  return (
    <div className="h-full px-5 pt-5">
      <p className="text-[24px] leading-5 semibold">Filename</p>
      <p className="opacity-50">date - size</p>
      <div className="w-full aspect-video border rounded-md my-5 grid place-items-center hover:opacity-50 transition-all">
        <ImFileEmpty className="" size={80} />
      </div>
      <FileField field="Filename" value={file.filename} />
      <hr className="my-2" />
      <FileField field="Size" value={file.size} />
      <hr className="my-2" />
      <FileField field="Created" value={new Date().toDateString()} />
    </div>
  );
};

const FilesPage = () => {
  const params = useParams();

  const { file, uploadFile } = useFile(params.fileId);

  return (
    <div className="w-screen h-screen bg-gray-100">
      <header className="h-[10%]">
        <Navbar />
      </header>
      <div className="flex">
        <div className="w-3/4 grid grid-cols-4 gap-5 p-5">
          {files.map((file, key) => (
            <File key={key} file={file} />
          ))}
          <label id="dropbox-label" htmlFor="dropbox">
            <input
              id="dropbox"
              className="hidden"
              type="file"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files) uploadFile(event.target.files[0]);
              }}
            />
            Upload File
          </label>
        </div>
        <div className="w-1/4 h-[90%] right-0 fixed border-l bg-white">
          {file === null ? "No file selected" : <FileInfo file={file} />}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
