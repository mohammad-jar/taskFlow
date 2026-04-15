"use client";
import Link from "next/link";
import { signIn, getProviders } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SpinnerElement from '@/components/SpinnerElement'

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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // if come from protect page so will go to page that come from it
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [state, setState] = useState({
    error: "",
    isPending: false,
  });

  const [providerState, setProviderState] = useState({
    error: "",
    isPending: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setState({
      error: "",
      isPending: true,
    });

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: callbackUrl,
    });

    if (!res?.ok) {
      setState({ error: "Invalid email or password.", isPending: false });
      return;
    }
    router.push(callbackUrl);
    setState({ error: "", isPending: false });
  };

  const hendleGoogleLogin = async () => {
    setProviderState({
      error: "",
      isPending: true,
    });
    const provider = await getProviders();
    await signIn(provider?.google.id, { callbackUrl });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={hendleGoogleLogin}
          disabled={providerState.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
        >
          <span className="text-base">G</span>
          {providerState.isPending ? "..." : " Continue with Google"}
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
          Or Login with email
        </p>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleCredentialsLogin} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email address
          </span>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) =>
              setData((prev) => ({ ...prev, email: e.target.value }))
            }
            className={inputClassName}
          />
        </label>

        <PasswordField
          id="password"
          label="Password"
          placeholder="Create a secure password"
          value={data.password}
          open={showPassword}
          onChange={handleChange}
          onToggle={() => setShowPassword((current) => !current)}
        />

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={state.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {state.isPending ? (
            
              <SpinnerElement />
              
            
          ) : (
            "Create your account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        dont have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-slate-900 underline decoration-amber-400 underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
