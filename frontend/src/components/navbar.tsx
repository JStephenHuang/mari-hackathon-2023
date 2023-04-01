import { IoCloudCircle } from "react-icons/io5";
import { RxCaretRight } from "react-icons/rx";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full h-[10%] fixed  border-b flex items-center px-5 bg-white">
      <Link to="/">
        <IoCloudCircle className="text-blue-500" size={30} />
      </Link>
      <p className="text-[20px] bold ml-2">ReDrive</p>
      <RxCaretRight size={20} />
      <p>All items</p>
    </div>
  );
};

export default Navbar;
