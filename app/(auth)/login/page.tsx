
import LoginForm from "@/components/auth/LoginForm";
const LoginPage = () => {
  return (
    <main className="font-sans">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center py-4">
        <section className="">
          <div className="rounded-4xl border border-white/70  p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur ">
            <div className="rounded-[1.6rem] border border-black/5 p-6 sm:p-8">
              <h2 className="text-3xl text-center mb-5 font-semibold tracking-tight text-slate-950">
                Start your workspace
              </h2>

              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
