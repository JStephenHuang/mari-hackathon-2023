import { ImFileEmpty } from "react-icons/im";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFile } from "../hooks/useFile";
import { useScript } from "../hooks/useScript";
import { IFile } from "../types/types";

import files from "../../../backend/data.json";

import Navbar from "../components/navbar";

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
          {file.created.split("T")[0]} - {file.size}
        </p>
      </div>
    </NavLink>
  );
};

const FileInfo = ({
  file,
  deleteFile,
}: {
  file: IFile | undefined;
  deleteFile: () => void;
}) => {
  const navigate = useNavigate();

  if (file === undefined)
    return <div>Oops something went wrong with the file...</div>;

  console.log();

  return (
    <div className="h-full px-5 pt-5">
      <p className="text-[24px] leading-5 semibold">Filename</p>
      <p className="opacity-50">date - size</p>
      <div className="w-full aspect-video border rounded-md my-5 grid place-items-center hover:opacity-50 transition-all">
        <ImFileEmpty className="" size={80} />
      </div>
      <FileField field="Filename" value={file.filename} />
      <hr className="my-2" />
      <FileField field="Size" value={`${file.size}`} />
      <hr className="my-2" />
      <FileField field="Created" value={file.created.split("T")[0]} />
      <div className="my-6" />
      <div className="w-full flex justify-between">
        <a
          href={`http://localhost:5000/${file.path}`}
          className="px-6 py-3 bg-black text-white hover:bg-transparent hover:text-black border border-black transition-all"
        >
          Download
        </a>
        <button
          className="px-6 py-3 bg-transparent text-red-500 hover:bg-red-500 hover:text-white border border-red-500 transition-all"
          onClick={deleteFile}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const FilesPage = () => {
  const params = useParams();

  const { file, uploadFile, deleteFile } = useFile(params.fileId);

  return (
    <div className="w-screen h-screen bg-gray-100">
      <header className="h-[10%]">
        <Navbar />
      </header>
      <div className="flex">
        <div className="w-3/4 grid grid-cols-4 gap-5 p-5">
          {files.file.map((file, key) => (
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
          {file === null ? (
            "No file selected"
          ) : (
            <FileInfo file={file} deleteFile={deleteFile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
