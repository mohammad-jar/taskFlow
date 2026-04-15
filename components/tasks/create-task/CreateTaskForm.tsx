"use client";

import { useActionState, useEffect, useRef } from "react";
import { ClipboardList, AlignLeft, Flag, CalendarDays } from "lucide-react";

import SubmitButton from "./SubmitButton";
import SectionIcon from "./SectionIcon";
import { createTaskAction } from "@/actions/tasks/createtask";
import toast from "react-hot-toast";
import { getElementClassName } from "@/lib/utils";

const initialState = {
  success: false,
  message: "",
  values: {
    title: "",
    description: "",
    priority: "",
    dueDate: "",
  },
  errors: {},
};



const CreateTaskForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createTaskAction, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      formRef.current?.reset();
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <form ref={formRef} action={formAction} className="space-y-2">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="flex gap-4">
            <SectionIcon bgClassName="bg-blue-50" iconClassName="text-blue-600">
              <ClipboardList size={22} />
            </SectionIcon>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Design Login Page"
                className={getElementClassName('input')}
                defaultValue={state.values.title}
              />
              {state.errors?.title && (
                <p className={getElementClassName('error')}>{state.errors.title}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <SectionIcon bgClassName="bg-sky-50" iconClassName="text-sky-600">
              <AlignLeft size={22} />
            </SectionIcon>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Add task description, details, or notes..."
                className={getElementClassName('textarea')}
                defaultValue={state.values.description}
              />
              {state.errors?.description && (
                <p className={getElementClassName('error')}>{state.errors.description}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <SectionIcon
              bgClassName="bg-amber-50"
              iconClassName="text-amber-600"
            >
              <Flag size={22} />
            </SectionIcon>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                className={getElementClassName('select')}
                defaultValue={state.values.priority}
              >
                <option value="" disabled>
                  Select Priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {state.errors?.priority && (
                <p className={getElementClassName('error')}>{state.errors.priority}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <SectionIcon
              bgClassName="bg-emerald-50"
              iconClassName="text-emerald-600"
            >
              <CalendarDays size={22} />
            </SectionIcon>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                name="dueDate"
                type="date"
                className={getElementClassName('input')}
                defaultValue={state.values.dueDate}
              />
              {state.errors?.dueDate && (
                <p className={getElementClassName('error')}>{state.errors.dueDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            type="reset"
            className="h-12 cursor-pointer rounded-2xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <SubmitButton name='Create Task' />
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;
