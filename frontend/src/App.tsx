import { Route, Routes } from "react-router-dom";

import MainPage from "./pages/main-page";
import FilesPage from "./pages/files-page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="/storage" element={<FilesPage />}></Route>
      <Route path="/storage/:fileId" element={<FilesPage />}></Route>
    </Routes>
  );
};

export default App;
