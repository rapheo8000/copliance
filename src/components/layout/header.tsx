"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold lg:hidden">Copliance</h1>
      </div>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Deconnexion
      </Button>
    </header>
  );
}
