import axios from "axios";
import { useEffect, useState } from "react";
import { IFile } from "../types/types";
import _files from "../../../backend/data.json";

const backend = axios.create({ baseURL: "http://localhost:5000" });

export const useFile = (fileId: string | undefined) => {
  const [file, setFile] = useState<IFile | null>();

  const uploadFile = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await backend
      .post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .catch((error) => console.log(error));

    if (res) console.log(res.data);
  };

  const deleteFile = async () => {
    const res = await backend
      .delete(`/remove/${fileId}`)
      .catch((error) => console.log(error));

    if (res) console.log(res.data);
  };

  useEffect(() => {
    if (fileId === undefined) return setFile(null);

    const files = _files.file as IFile[];

    setFile(files[files.map((file) => file.id).indexOf(fileId)]);
  }, [fileId]);

  return { file, uploadFile, deleteFile };
};
