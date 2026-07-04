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
    <div className="surface-panel relative mb-6 flex flex-col gap-4 overflow-hidden p-5 md:flex-row md:items-center md:justify-between">
      <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-blue-100/70 blur-2xl" />
      <div className="absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-emerald-100/40 blur-2xl" />

      <div className="relative">
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
          className="primary-action relative h-10 w-fit"
        >
          <Plus size={20} />
          {right_link}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
