"use client";

import { updateProfileAction } from "@/actions/profile/updateProfileAction";
import { Camera, CheckCircle2, Loader2, Mail, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProfileSettingsFormProps = {
  initialState: ProfileFormState;
};

const ProfileSettingsForm = ({ initialState }: ProfileSettingsFormProps) => {
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectPreviewUrlRef = useRef<string | null>(null);
  const lastHandledResultRef = useRef<string | undefined>(undefined);
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const [name, setName] = useState(initialState.values.name);
  const [previewUrl, setPreviewUrl] = useState(initialState.values.image);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    if (!state.resultId || lastHandledResultRef.current === state.resultId) {
      return;
    }

    lastHandledResultRef.current = state.resultId;

    if (state.success) {
      toast.success(state.message);
      update({
        user: {
          name: state.values.name,
          image: state.values.image || null,
        },
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [
    state.message,
    state.resultId,
    state.success,
    state.values.image,
    state.values.name,
    update,
  ]);

  useEffect(() => {
    return () => {
      if (objectPreviewUrlRef.current) {
        URL.revokeObjectURL(objectPreviewUrlRef.current);
      }
    };
  }, []);

  const handleAvatarPreview = (file?: File) => {
    if (!file) {
      setAvatarError("");
      return;
    }

    if (!ALLOWED_AVATAR_TYPES.includes(file.type) || file.size > MAX_AVATAR_SIZE) {
      setAvatarError("Avatar must be JPG, PNG, or WebP and under 2MB.");
      toast.error("Avatar must be JPG, PNG, or WebP and under 2MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (objectPreviewUrlRef.current) {
      URL.revokeObjectURL(objectPreviewUrlRef.current);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    objectPreviewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    setAvatarError("");
  };

  const initials = getInitials(name || state.values.email);

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-sm shadow-blue-100/60 md:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-blue-100 via-white to-slate-100 shadow-sm">
              {previewUrl ? (
                <div
                  aria-label="Profile avatar preview"
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${previewUrl}")` }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-blue-600">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                Profile photo
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                Make your workspace feel personal
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Upload a JPG, PNG, or WebP image under 2MB. Your avatar appears
                in the navbar and task collaboration areas.
              </p>
            </div>
          </div>

          <label className="inline-flex h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">
            <Camera size={17} />
            Upload avatar
            <input
              ref={fileInputRef}
              type="file"
              name="avatar"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => handleAvatarPreview(event.target.files?.[0])}
            />
          </label>
        </div>

        {(avatarError || state.errors?.avatar) && (
          <p className="mt-4 text-sm text-red-500">
            {avatarError || state.errors?.avatar}
          </p>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-sm shadow-blue-100/60 md:p-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Account details
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Edit your profile
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your display name is visible to teammates. Email is shown for
              reference and cannot be changed here.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                <UserRound size={16} className="text-blue-600" />
                Display name
              </span>
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Your display name"
              />
              {state.errors?.name && (
                <p className="mt-2 text-sm text-red-500">{state.errors.name}</p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                <Mail size={16} className="text-blue-600" />
                Email address
              </span>
              <input
                value={state.values.email || "No email on file"}
                disabled
                className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
              />
              <p className="mt-2 text-xs text-slate-400">
                Email editing is disabled to keep account identity safe.
              </p>
            </label>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/80 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5 shadow-sm md:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <CheckCircle2 size={22} />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-950">
            Profile safety
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Profile updates are scoped to your logged-in account. The form never
            accepts a user id from the browser, so another user cannot be edited
            through this action.
          </p>
        </aside>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || Boolean(avatarError)}
          className="inline-flex h-12 min-w-40 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Saving
            </>
          ) : (
            "Save profile"
          )}
        </button>
      </div>
    </form>
  );
};

function getInitials(value: string) {
  const fallback = value.trim() || "User";
  return fallback
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default ProfileSettingsForm;
