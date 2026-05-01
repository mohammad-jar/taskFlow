import Link from "next/link";
import Image from "next/image";

type props = {
  title: string;
  desc: string;
  link_name: string;
  next_page: string;
};

const ItemsNotFound = ({ title, desc, link_name, next_page}: props) => {
  return (
    <div className="flex flex-col space-y-2 mx-auto items-center justify-center mt-15 mr-12">
      <Image
        src="/notfound.png"
        width={120}
        height={120}
        alt="notfound items"
        className="rounded-lg"
      />
      <div className="flex items-center flex-col space-y-2">
        <h1 className="font-semibold text-xl text-slate-900">{title}</h1>
        <p className=" text-md text-slate-400">{desc} </p>
        <Link
          href={next_page}
          className="inline-flex cursor-pointer h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-md font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {link_name}
        </Link>
      </div>
    </div>
  );
};

export default ItemsNotFound;
