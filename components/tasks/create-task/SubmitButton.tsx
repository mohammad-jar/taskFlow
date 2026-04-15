"use client";

import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import SpinnerElement from "@/components/SpinnerElement";

const SubmitButton = ({ name }: { name: string }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Plus size={18} />
      {pending ? <SpinnerElement /> : name}
    </button>
  );
};

export default SubmitButton;
