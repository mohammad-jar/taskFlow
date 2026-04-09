import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <main className="font-sans">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center py-4">
        <section className="">
          <div className="rounded-4xl border border-white/70  p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur ">
            <div className="rounded-[1.6rem] border border-black/5 p-6 sm:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-amber-600">
                    Create account
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    Start your workspace
                  </h2>
                </div>
                <Link
                  href="/login"
                  className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
                >
                  Sign in
                </Link>
              </div>

              <RegisterForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
