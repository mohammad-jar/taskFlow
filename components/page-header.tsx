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
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm shadow-blue-100/60 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        {title1 && (
          <p className="mb-2 hidden text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 sm:block">
            {title1}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title2}
        </h1>
        {desc && (
          <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-slate-500 sm:block">
            {desc}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={20} />
          {right_link}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
