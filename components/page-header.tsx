import { Plus } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  desc: string;
  right_link?: string;
  href?: string;
};
const PageHeader = ({ title, desc, right_link, href }: Props) => {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="mb-2 text-xs   uppercase tracking-wide text-blue-600">
          {title}
        </p>
        <h1 className="text-4xl  tracking-tight text-slate-900">{title}</h1>
        <p className="my-2 text-lg text-slate-500">{desc}</p>
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex cursor-pointer h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-md font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={20} />
          {right_link}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
