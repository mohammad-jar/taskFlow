import { Plus } from "lucide-react";
import Link from "next/link";

type Props = {
  title1?: string;
  title2?: string;
  desc?: string;
  right_link?: string;
  href?: string;
};
const PageHeader = ({ title1, title2, desc, right_link, href }: Props) => {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        {title1 && <p className="hidden sm:block mb-1 text-md font-medium uppercase tracking-wide text-blue-700">
          {title1}
        </p>}
        <h1 className="text-2xl text-blue-600 sm:4xl tracking-tight sm:text-slate-900">{title2}</h1>
        {desc && <p className="hidden sm:block my-1 text-lg text-slate-500">{desc}</p>}
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex cursor-pointer h-8 sm:h-10 items-center justify-center sm:gap-2 rounded-md bg-blue-600 px-2 sm:px-4 text-md font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={20} />
          {right_link}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
