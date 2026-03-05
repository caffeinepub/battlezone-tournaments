import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="mt-auto border-t py-6"
      style={{
        borderColor: "rgba(0,245,255,0.1)",
        background: "rgba(8,8,16,0.8)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="text-xs text-center md:text-left"
            style={{ color: "#475569" }}
          >
            <p className="mb-1" style={{ color: "#374151" }}>
              ⚠️ This website is NOT affiliated with, endorsed by, or connected
              to Garena Free Fire or its developers.
            </p>
            <p style={{ color: "#374151" }}>
              Free Fire is a trademark of Garena. 14+ only. Skill-based
              competitions.
            </p>
          </div>
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: "#475569" }}
          >
            <Link
              to="/legal/terms"
              data-ocid="footer.terms.link"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/legal/privacy"
              data-ocid="footer.privacy.link"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <span className="flex items-center gap-1">
              © {year}. Built with{" "}
              <Heart className="w-3 h-3 text-red-400 fill-red-400" /> using{" "}
              <a
                href={utmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                style={{ color: "#00f5ff" }}
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
