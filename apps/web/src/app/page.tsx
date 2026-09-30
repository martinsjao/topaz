"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Carregando…
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Sessão ativa</p>
        <h1 className="mt-1 text-lg font-medium">{session.user.name}</h1>
        <p className="text-sm text-muted-foreground">{session.user.email}</p>
      </div>
      <Button
        variant="outline"
        onClick={async () => {
          await authClient.signOut();
          router.replace("/login");
          router.refresh();
        }}
      >
        Sair
      </Button>
    </main>
  );
}
