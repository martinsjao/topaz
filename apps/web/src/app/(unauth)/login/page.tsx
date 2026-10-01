"use client";

import { GoogleLogo } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { appUrl } from "@/lib/env";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result =
      mode === "sign-in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name, email, password });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Não foi possível entrar.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function onGoogle() {
    setError(null);
    setPending(true);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: appUrl,
    });

    if (result.error) {
      setPending(false);
      setError(result.error.message ?? "Não foi possível entrar com o Google.");
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[oklch(0.94_0.018_85)] dark:bg-muted lg:flex lg:flex-col lg:justify-center lg:gap-8 lg:px-14 lg:py-16">
        <div className="relative z-10 max-w-md">
          <p className="text-xs font-medium tracking-[0.2em] text-accent-foreground uppercase">
            Topaz
          </p>
          <h2 className="mt-3 text-3xl leading-tight font-medium tracking-tight text-foreground">
            Organize o fluxo.
            <br />
            Foque no essencial.
          </h2>
        </div>

        <div className="relative z-10 h-112 w-full max-w-xl">
          <Image
            src="/kanbaman1.png"
            alt=""
            width={480}
            height={480}
            priority
            className="absolute top-0 left-0 z-10 h-auto w-88 object-contain"
          />
          <Image
            src="/kanbaman.png"
            alt=""
            width={520}
            height={392}
            priority
            className="absolute top-36 left-28 z-20 h-auto w-[24rem] object-contain"
          />
        </div>
      </aside>

      <section className="flex flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <p className="text-xs font-medium tracking-[0.2em] text-accent-foreground uppercase">
              Topaz
            </p>
          </div>

          <h1 className="text-2xl font-medium tracking-tight">
            {mode === "sign-in" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use e-mail e senha, ou continue com o Google.
          </p>

          <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
            {mode === "sign-up" ? (
              <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                Nome
                <input
                  className="h-10 border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            ) : null}

            <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              E-mail
              <input
                className="h-10 border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              Senha
              <input
                className="h-10 border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                type="password"
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error ? <p className="text-xs text-destructive">{error}</p> : null}

            <Button type="submit" disabled={pending} className="mt-1 w-full">
              {mode === "sign-in" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending}
            onClick={onGoogle}
          >
            <GoogleLogo data-icon="inline-start" />
            Entrar com Google
          </Button>

          <button
            type="button"
            className="mt-6 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            onClick={() => {
              setMode(mode === "sign-in" ? "sign-up" : "sign-in");
              setError(null);
            }}
          >
            {mode === "sign-in" ? "Ainda não tenho conta" : "Já tenho conta"}
          </button>
        </div>
      </section>
    </main>
  );
}
