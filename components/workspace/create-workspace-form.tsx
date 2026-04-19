"use client";

import { useActionState, useEffect, useRef } from "react";
import { createWorkspaceAction } from "@/actions/workspace/create-workspace-actions";
import SpinnerElement from "../SpinnerElement";
import toast from "react-hot-toast";

const CreateWorkspaceState: TCreateState = {
  success: false,
  message: "",
  errors: {},
};

export default function CreateWorkspaceForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createWorkspaceAction,
    CreateWorkspaceState,
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      formRef.current?.reset();
    }
  }, [state.success, state.message]);
  return (
    <div className="mx-auto w-1/2">
      <form
        ref={formRef}
        action={formAction}
        className="space-y-5  rounded-lg border bg-white p-6 shadow-sm"
      >
        <h2 className="text-3xl font-semibold text-slate-900">
          Create New Workspace
        </h2>

        <div className="space-y-3">
          <label
            htmlFor="name"
            className="text-lg  font-semibold text-slate-800"
          >
            Workspace Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Title of workspace"
            className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name}</p>
          )}
        </div>

        <div className="space-y-3">
          <label
            htmlFor="description"
            className="text-lg  font-semibold text-slate-800"
          >
            Description{" "}
            <span className="text-sm font-medium text-slate-600">
              (optional)
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Brief description..."
            className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.description && (
            <p className="text-sm text-red-500">{state.errors.description}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="reset"
            className="rounded-md cursor-pointer  px-4 py-2 text-md  border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-md cursor-pointer bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? <SpinnerElement /> : "Create Workspace"}
          </button>
        </div>
      </form>
    </div>
  );
}
