import { IoCloudCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="w-full h-full flex">
        <div className="w-1/2 flex flex-col items-start py-10 px-10">
          <IoCloudCircle className="text-blue-500 mb-20" size={80} />

          <h1 className="bold text-[80px] leading-[6rem] tracking-tighter">
            Revolutionize cloud storage by using old drives!
          </h1>
          <p className="my-4">Setup your virtual storage.</p>
          <Link
            className="px-6 py-3 bg-black text-white hover:bg-transparent hover:text-black border border-black transition-all"
            to="/storage"
          >
            Get started
          </Link>
        </div>
        <div className="w-1/2 bg-black bg-center bg-[url('https://static01.nyt.com/images/2016/10/22/technology/22bitsdaily/22bitsdaily-superJumbo.jpg')]"></div>
      </div>
    </div>
  );
};

export default MainPage;
