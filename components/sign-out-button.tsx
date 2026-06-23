"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
      onClick={handleSignOut}
      aria-label="Abmelden"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
