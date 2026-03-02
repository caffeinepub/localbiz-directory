import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import type { View } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  currentView: View;
  navigate: (view: View) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
}

export default function Header({
  currentView,
  navigate,
  isLoggedIn,
  isAdmin,
  isInitializing,
}: HeaderProps) {
  const { login, clear, isLoggingIn } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActiveView = (view: View) => view.name === currentView.name;

  const handleNavClick = (view: View) => {
    navigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick({ name: "home" })}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <MapPin className="w-4 h-4 text-amber" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Local<span className="text-amber">Biz</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleNavClick({ name: "home" })}
              data-ocid="nav.home_link"
              className={cn(
                "px-3 py-1.5 text-sm font-ui font-medium rounded-md transition-colors",
                isActiveView({ name: "home" })
                  ? "bg-accent/10 text-amber"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              Directory
            </button>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => handleNavClick({ name: "register" })}
                data-ocid="nav.register_link"
                className={cn(
                  "px-3 py-1.5 text-sm font-ui font-medium rounded-md transition-colors",
                  isActiveView({ name: "register" })
                    ? "bg-accent/10 text-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                Register Business
              </button>
            )}

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => handleNavClick({ name: "my-listings" })}
                data-ocid="nav.my_listings_link"
                className={cn(
                  "px-3 py-1.5 text-sm font-ui font-medium rounded-md transition-colors",
                  isActiveView({ name: "my-listings" })
                    ? "bg-accent/10 text-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                My Listings
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick({ name: "admin" })}
                data-ocid="nav.admin_link"
                className={cn(
                  "px-3 py-1.5 text-sm font-ui font-medium rounded-md transition-colors",
                  isActiveView({ name: "admin" })
                    ? "bg-accent/10 text-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                Admin Panel
              </button>
            )}
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {!isInitializing &&
              (isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.logout_button"
                  className="font-ui"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="nav.login_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-ui"
                >
                  {isLoggingIn ? "Signing in..." : "Sign In"}
                </Button>
              ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleNavClick({ name: "home" })}
              data-ocid="nav.home_link"
              className={cn(
                "w-full text-left px-3 py-2 text-sm font-ui rounded-md transition-colors",
                isActiveView({ name: "home" })
                  ? "bg-accent/10 text-amber"
                  : "text-muted-foreground",
              )}
            >
              Directory
            </button>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => handleNavClick({ name: "register" })}
                data-ocid="nav.register_link"
                className={cn(
                  "w-full text-left px-3 py-2 text-sm font-ui rounded-md transition-colors",
                  isActiveView({ name: "register" })
                    ? "bg-accent/10 text-amber"
                    : "text-muted-foreground",
                )}
              >
                Register Business
              </button>
            )}

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => handleNavClick({ name: "my-listings" })}
                data-ocid="nav.my_listings_link"
                className={cn(
                  "w-full text-left px-3 py-2 text-sm font-ui rounded-md transition-colors",
                  isActiveView({ name: "my-listings" })
                    ? "bg-accent/10 text-amber"
                    : "text-muted-foreground",
                )}
              >
                My Listings
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick({ name: "admin" })}
                data-ocid="nav.admin_link"
                className={cn(
                  "w-full text-left px-3 py-2 text-sm font-ui rounded-md transition-colors",
                  isActiveView({ name: "admin" })
                    ? "bg-accent/10 text-amber"
                    : "text-muted-foreground",
                )}
              >
                Admin Panel
              </button>
            )}

            <div className="pt-2 border-t border-border mt-1">
              {!isInitializing &&
                (isLoggedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.logout_button"
                    className="w-full font-ui"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn}
                    data-ocid="nav.login_button"
                    className="w-full bg-primary text-primary-foreground font-ui"
                  >
                    {isLoggingIn ? "Signing in..." : "Sign In"}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
