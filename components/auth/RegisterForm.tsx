"use client";
import { registerUser, type RegisterState } from "@/actions/auth/register-user";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const initialState: RegisterState = {
  error: "",
  success: "",
  values: {
    name: "",
    email: "",
  },
};

const inputClassName =
  "w-full rounded-2xl border border-black/20 bg-white/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-amber-200/60";
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a3 3 0 0 0 4 4" />
      <path d="M9.9 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-4.1 4.9" />
      <path d="M6.7 6.7C4.3 8.4 2.8 12 2.8 12A17.8 17.8 0 0 0 12 19c1.8 0 3.4-.4 4.8-1.1" />
    </svg>
  );
}
function PasswordField({
  id,
  label,
  placeholder,
  value,
  open,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  open: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          type={open ? "text" : "password"}
          placeholder={placeholder}
          className={`${inputClassName} pr-12`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? `Hide ${label}` : `Show ${label}`}
          className="absolute inset-y-0 right-3 my-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <EyeIcon open={open} />
        </button>
      </div>
    </label>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );
  const router = useRouter();

  // login after register successfully
  useEffect(() => {
    if (state.success && state.values.email && password) {
      setAuthError("");

      signIn("credentials", {
        email: state.values.email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      }).then((result) => {
        if (!result?.ok) {
          setAuthError("Account created, but automatic login failed.");
          return;
        }

        router.push("/dashboard");
        router.refresh();
      });
    }
  }, [state.success, state.values.email, password, router]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
        >
          <span className="text-base">G</span>
          Continue with Google
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
        >
          <span className="text-base">A</span>
          Continue with Apple
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
          Or register with email
        </p>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={formAction} className="space-y-5">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Full name
          </span>
          <input
            name="name"
            type="text"
            placeholder="Enter your full name"
            defaultValue={state.values.name}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email address
          </span>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue={state.values.email}
            className={inputClassName}
          />
        </label>

        <PasswordField
          id="password"
          label="Password"
          placeholder="Create a secure password"
          value={password}
          open={showPassword}
          onChange={(event) => setPassword(event.target.value)}
          onToggle={() => setShowPassword((current) => !current)}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          open={showConfirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          onToggle={() => setShowConfirmPassword((current) => !current)}
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        {authError && <p className="text-sm text-red-600">{authError}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isPending ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Creating your account...
            </>
          ) : (
            "Create your account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-slate-900 underline decoration-amber-400 underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
