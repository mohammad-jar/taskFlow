import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type props = {
  title: string;
  desc: string;
  link_name: string;
  next_page: string;
};

const ItemsNotFound = ({ title, desc, link_name, next_page }: props) => {
  return (
    <div className="surface-panel mx-auto mt-10 flex max-w-xl flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-100 blur-2xl" />
        <Image
          src="/notfound.png"
          width={128}
          height={128}
          alt="notfound items"
          className="relative rounded-3xl border border-white bg-white/80 p-3 shadow-sm"
        />
      </div>
      <div className="mt-5 flex flex-col items-center space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="max-w-md text-sm leading-6 text-slate-500">{desc}</p>
        <Link
          href={next_page}
          className="primary-action mt-2"
        >
          {link_name}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ItemsNotFound;
