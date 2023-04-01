import axios from "axios";
import { useEffect } from "react";

const backend = axios.create({ baseURL: "http://localhost:5000" });

export const useScript = () => {
  useEffect(() => {
    (async () => {
      const res = await backend
        .get("/script_file")
        .catch((error) => console.log(error));

      if (res) console.log(res.data.output);
    })();
  }, []);

  return {};
};
