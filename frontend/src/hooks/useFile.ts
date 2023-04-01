import axios from "axios";
import { useEffect, useState } from "react";

const backend = axios.create({ baseURL: "http://localhost:5000" });

const files = [
  {
    filename: "filename1",
    size: "50mb",
    date: "2023/03/31",
    id: "1234",
  },
  {
    filename: "filename2",
    size: "100mb",
    date: "2023/03/31",
    id: "5678",
  },
  {
    filename: "filename3",
    size: "50mb",
    date: "2023/03/31",
    id: "9012",
  },
];

export const useFile = (fileId: string | undefined) => {
  const [file, setFile] = useState<{
    filename: string;
    size: string;
    date: string;
    id: string;
  } | null>();

  const uploadFile = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await backend
      .post("upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .catch((error) => console.log(error));

    if (res) console.log(res.data);
  };

  useEffect(() => {
    if (fileId === undefined) return setFile(null);

    setFile(files[files.map((file) => file.id).indexOf(fileId)]);
  }, [fileId]);

  return { file, uploadFile };
};
