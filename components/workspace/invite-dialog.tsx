"use client";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateForm from "./create-form";
import { Plus } from "lucide-react";
import { useState } from "react";

const InviteMemberDialog = ({ workspace }: { workspace: TWorkspace }) => {
    const [open, setOpen] = useState(false);
  const formInfo = [
    {
      label: "Email Address",
      type: "input",
      placeholder: "Entire Email Address ",
      name: "email",
    },
    {
      label: "Role",
      type: "select",
      placeholder: "",
      name: "role",
    },
    {
      label: "Message",
      type: "textarea",
      placeholder: "Hi! I'd like to invite you to join our workspace.",
      name: "message",
    },
  ];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex cursor-pointer h-8 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-md font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={20} />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Invite Member</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <CreateForm
          title={`Invite Member to ${workspace.name}`}
          formInfo={formInfo}
          api="invite"
          workspace_id={workspace.id}
          workspace_name= {workspace.name}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
