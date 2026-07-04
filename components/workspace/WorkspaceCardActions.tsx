"use client";

import {
  deleteWorkspaceAction,
  updateWorkspaceAction,
  type WorkspaceEditState,
} from "@/actions/workspace/workspace-card-actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  Loader2,
  MoreVertical,
  PencilLine,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

type WorkspaceCardActionsProps = {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    role: "OWNER" | "ADMIN" | "MEMBER";
  };
};

const initialEditState: WorkspaceEditState = {
  success: false,
  message: "",
  errors: {},
};

export default function WorkspaceCardActions({
  workspace,
}: WorkspaceCardActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isEditing, startEditTransition] = useTransition();
  const [editState, setEditState] = useState(initialEditState);

  const canEdit = workspace.role === "OWNER" || workspace.role === "ADMIN";
  const canDelete = workspace.role === "OWNER";

  const handleEditOpenChange = (nextOpen: boolean) => {
    setEditOpen(nextOpen);
    if (nextOpen) {
      setEditState(initialEditState);
    }
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startEditTransition(async () => {
      const result = await updateWorkspaceAction(editState, formData);
      setEditState(result);

      if (result.success) {
        toast.success(result.message);
        setEditOpen(false);
        router.refresh();
        return;
      }

      if (result.message) {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteWorkspaceAction(workspace.id);

      if (result.success) {
        toast.success(result.message);
        setDeleteOpen(false);
        router.refresh();
        return;
      }

      toast.error(result.message);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Workspace options for ${workspace.name}`}
            className="rounded-2xl text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-sm"
          >
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-3xl border-white/80 bg-white/95 p-2 shadow-xl shadow-blue-100/70 backdrop-blur"
        >
          <DropdownMenuItem asChild className="rounded-2xl px-3 py-2">
            <Link href={`/workspaces/${workspace.id}`}>
              <ExternalLink size={16} />
              Open workspace
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={!canEdit}
            onSelect={() => setEditOpen(true)}
            className="rounded-2xl px-3 py-2"
          >
            <PencilLine size={16} />
            Edit workspace
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!canDelete}
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
            className="rounded-2xl px-3 py-2"
          >
            <Trash2 size={16} />
            Delete workspace
          </DropdownMenuItem>

          {!canDelete && (
            <p className="px-3 py-2 text-xs leading-5 text-slate-400">
              Only workspace owners can delete a workspace.
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="max-w-lg rounded-3xl border-white/80 bg-white/95 p-0 shadow-xl shadow-blue-100/70">
          <form onSubmit={handleEditSubmit}>
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                  Edit workspace
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-slate-500">
                  Update the name and description your team sees across
                  TaskFlow.
                </DialogDescription>
              </DialogHeader>

              <input type="hidden" name="workspaceId" value={workspace.id} />

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Workspace name
                  </span>
                  <input
                    name="name"
                    defaultValue={workspace.name}
                    className="field-control h-12"
                    placeholder="Workspace name"
                  />
                  {editState.errors?.name && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {editState.errors.name}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Description
                  </span>
                  <textarea
                    name="description"
                    defaultValue={workspace.description || ""}
                    rows={4}
                    className="field-control py-3"
                    placeholder="Describe how this workspace is used"
                  />
                  {editState.errors?.description && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {editState.errors.description}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <DialogFooter className="rounded-b-3xl border-slate-100 bg-slate-50/80 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isEditing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEditing}>
                {isEditing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-3xl border-white/80 bg-white/95 shadow-xl shadow-red-100/70">
          <AlertDialogHeader>
            <AlertDialogMedia className="rounded-2xl bg-red-50 text-red-600">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-lg font-semibold text-slate-950">
              Delete {workspace.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-6">
              This will permanently delete the workspace, its tasks, invites,
              and related activity. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="rounded-b-3xl border-slate-100 bg-slate-50/80">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting
                </>
              ) : (
                "Delete workspace"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
