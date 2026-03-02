import { Toaster } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { backend } from "./backendClient";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminView from "./views/AdminView";
import BusinessDetailView from "./views/BusinessDetailView";
// ── Views ──────────────────────────────────────────────────────────────────
import HomeView from "./views/HomeView";
import MyListingsView from "./views/MyListingsView";
import RegisterView from "./views/RegisterView";

export type View =
  | { name: "home" }
  | { name: "business-detail"; businessId: string }
  | { name: "register" }
  | { name: "my-listings" }
  | { name: "admin" };

export default function App() {
  const [currentView, setCurrentView] = useState<View>({ name: "home" });
  const { identity, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity;

  // Determine admin status
  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return false;
      try {
        return await backend.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !isInitializing,
    staleTime: 30_000,
  });

  const navigate = useCallback((view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentView={currentView}
        navigate={navigate}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        isInitializing={isInitializing}
      />

      <main className="flex-1">
        {currentView.name === "home" && <HomeView navigate={navigate} />}
        {currentView.name === "business-detail" && (
          <BusinessDetailView
            businessId={currentView.businessId}
            navigate={navigate}
            isLoggedIn={isLoggedIn}
          />
        )}
        {currentView.name === "register" && (
          <RegisterView navigate={navigate} isLoggedIn={isLoggedIn} />
        )}
        {currentView.name === "my-listings" && (
          <MyListingsView navigate={navigate} isLoggedIn={isLoggedIn} />
        )}
        {currentView.name === "admin" && (
          <AdminView navigate={navigate} isAdmin={isAdmin} />
        )}
      </main>

      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
