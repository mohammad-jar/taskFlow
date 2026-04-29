import { editTaskAction } from "@/actions/tasks/editTaskAction";
import { AlignLeft, CalendarDays, ClipboardList, Flag } from "lucide-react";
import { useActionState, useEffect } from "react";
import SectionIcon from "../create-task/SectionIcon";
import { formatDate, getElementClassName } from "@/lib/utils";
import SubmitButton from "../create-task/SubmitButton";
import toast from "react-hot-toast";
import type { Task } from "@/generated/prisma/client";

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
const EditTaskForm = ({ task , onClose}: { task: Task, onClose: () => void }) => {
  const [state, formAction] = useActionState(editTaskAction, initialState);

  useEffect(() => {
    if (!state.success || !state.message) {
      return;
    }

    onClose();
    toast.success(state.message, { id: "edit-task-success" });
  }, [state.success, state.message, onClose]);
  return (
    <div className="px-3 -mt-4 shadow-sm md:p-4">
      <form action={formAction} className="space-y-2">
        <div className="grid grid-cols-1 gap-6 ">
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
                className={getElementClassName("input")}
                defaultValue={task.title ?? ''}
              />
              {state.errors?.title && (
                <p className={getElementClassName("error")}>
                  {state.errors.title}
                </p>
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
                className={getElementClassName("textarea")}
                defaultValue={task.description ?? ''}
              />
              {state.errors?.description && (
                <p className={getElementClassName("error")}>
                  {state.errors.description}
                </p>
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
                className={getElementClassName("select")}
                defaultValue={task.priority ?? ''}
              >
                <option value="" disabled className="">
                  current priority : {task.priority.toLowerCase()}
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {state.errors?.priority && (
                <p className={getElementClassName("error")}>
                  {state.errors.priority}
                </p>
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
                className={getElementClassName("input")}
                defaultValue={formatDate(task.dueDate || '')}
              />
              {state.errors?.dueDate && (
                <p className={getElementClassName("error")}>
                  {state.errors.dueDate}
                </p>
              )}
            </div>
          </div>
        </div>
        <input type="text" hidden name="taskId" defaultValue={task.id} />
        <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-6">
          <button
          onClick={onClose}
            type="reset"
            className="h-12 cursor-pointer rounded-2xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <SubmitButton name="Save Changes"/>
        </div>
      </form>

    </div>
  );
};

export default EditTaskForm;
