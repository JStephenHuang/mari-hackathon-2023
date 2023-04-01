import { RxCaretRight } from "react-icons/rx";
import { ImFileEmpty } from "react-icons/im";
import { IoCloudCircle } from "react-icons/io5";
import { Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { useFile } from "./hooks/useFile";
import { useScript } from "./hooks/useScript";

import MainPage from "./pages/main-page";
import FormPage from "./pages/form-page";
import FilesPage from "./pages/files-page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="/form" element={<FormPage />}></Route>
      <Route path="/storage" element={<FilesPage />}></Route>
      <Route path="/storage/:fileId" element={<FilesPage />}></Route>
    </Routes>
  );
};

export default App;
