import { Link } from "react-router-dom";

const FormPage = () => {
  return (
    <div className="w-screen flex flex-col items-center py-20">
      <p className="bold text-[40px]">Setup your virtual storage!</p>
      <Link
        to="/storage"
        className="px-6 py-2 bg-black text-white hover:bg-transparent hover:text-black border-black border transition-all"
      >
        Format
      </Link>
    </div>
  );
};

export default FormPage;
