"use client";

import { useActionState, useEffect, useRef } from "react";
import { createWorkspaceAction } from "@/actions/workspace/create-workspace-actions";
import { inviteMembersAction } from "@/actions/workspace/invites/workspace-invite-actions";
import SpinnerElement from "../SpinnerElement";
import toast from "react-hot-toast";
import { getElementClassName } from "@/lib/utils";

const initialState: TCreateState = {
  success: false,
  message: "",
  errors: {},
};
interface FormField {
  label: string;
  type: string;
  placeholder: string;
  name: string;
}

interface CreateFormProps {
  title: string;
  formInfo: FormField[];
  api: "workspace" | "invite";
  workspace_id?: string;
}

export default function CreateForm({
  title,
  formInfo,
  api,
  workspace_id,
}: CreateFormProps) {
    if (!workspace_id && api === 'invite') {
      console.log('whyyy');
      
        return null;
    }
  const formRef = useRef<HTMLFormElement>(null);
  const selectedAction =
    api === "workspace"
      ? createWorkspaceAction
      : (prevState: TCreateState, formData: FormData) =>
          inviteMembersAction(prevState, formData, workspace_id);

  const [state, formAction, isPending] = useActionState(
    selectedAction,
    initialState,
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      formRef.current?.reset();
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className={`${api === 'invite' ? '': 'mx-auto w-1/2 max-w-2xl'}`}>
      <form
        ref={formRef}
        action={formAction}
        className={`${api === 'invite' ? '': 'space-y-5 rounded-lg border bg-white p-6 shadow-sm'}`}
      >
        <h2 className="text-3xl font-semibold text-slate-900 mb-2">{title}</h2>

        <div className="space-y-5">
          {formInfo.map((field) => {
            const fieldError = state.errors?.[field.name];
            const input_type = field.name === "email" ? "email" : "text";
            const isOptional =
              field.name === "description" || field.name === "message";

            return (
              <div key={field.name} className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-lg font-semibold text-slate-800"
                >
                  {field.label}{" "}
                  {isOptional && (
                    <span className="text-sm font-medium text-slate-600">
                      (optional)
                    </span>
                  )}
                </label>

                {field.type === "input" && (
                  <input
                    id={field.name}
                    type={input_type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className={getElementClassName("input")}
                  />
                )}

                {field.type === "select" && (
                  <select name="role" className={getElementClassName("select")}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                )}

                {field.type === "textarea" && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    placeholder={field.placeholder}
                    className={getElementClassName("textarea")}
                  />
                )}

                {fieldError && (
                  <p className="text-sm text-red-500">{fieldError}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="reset"
            disabled={isPending}
            className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? <SpinnerElement /> : "Apply"}
          </button>
        </div>
      </form>
    </div>
  );
}
