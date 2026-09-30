"use client";

import { GoogleLogo } from "@phosphor-icons/react";
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
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm border border-border bg-card p-6 text-card-foreground">
        <h1 className="text-lg font-medium tracking-tight">
          {mode === "sign-in" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use e-mail e senha, ou continue com o Google.
        </p>

        <form className="mt-6 flex flex-col gap-3" onSubmit={onSubmit}>
          {mode === "sign-up" ? (
            <label className="flex flex-col gap-1 text-xs">
              Nome
              <input
                className="h-8 border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          ) : null}

          <label className="flex flex-col gap-1 text-xs">
            E-mail
            <input
              className="h-8 border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            Senha
            <input
              className="h-8 border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
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

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
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
          <GoogleLogo />
          Entrar com Google
        </Button>

        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setError(null);
          }}
        >
          {mode === "sign-in" ? "Ainda não tenho conta" : "Já tenho conta"}
        </button>
      </div>
    </main>
  );
}
