import { Heart, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
              <MapPin className="w-3.5 h-3.5 text-amber" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Local<span className="text-amber">Biz</span>
            </span>
            <span className="text-muted-foreground text-sm ml-2">
              Discover your local community
            </span>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            © {year}. Built with{" "}
            <Heart className="w-3.5 h-3.5 text-amber fill-amber" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
