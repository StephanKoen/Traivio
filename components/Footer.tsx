import Link from "next/link";
import AmaraLogo from "./AmaraLogo";

const JOURNEY_LINKS = [
  { href: "/journeys/the-migration", label: "The Migration" },
  { href: "/journeys/the-grand-circuit", label: "The Grand Circuit" },
  { href: "/journeys/the-family-legacy", label: "The Family Legacy" },
  { href: "/journeys/the-cape-and-kruger", label: "The Cape & Kruger" },
  { href: "/journeys/the-falls-and-delta", label: "The Falls & Delta" },
  { href: "/journeys/the-coastal-escape", label: "The Coastal Escape" },
];

const DISCOVER_LINKS = [
  { href: "/the-experience", label: "The Experience" },
  { href: "/about", label: "About" },
  { href: "/journeys", label: "All Journeys" },
  { href: "/enquire", label: "Enquire Privately" },
];

const OFFICES = [
  {
    city: "Dubai",
    line1: "Jumeirah Village Circle",
    line2: "Dubai · UAE",
  },
  {
    city: "George",
    line1: "Garden Route",
    line2: "South Africa",
  },
];

export default function Footer() {
  return (
    <footer
      data-theme="dark"
      className="pt-[84px] pb-8 px-[20px] md:px-[40px] md:pt-[72px] md:pb-7"
      style={{
        background: "var(--dd-near-black)",
        borderTop: "0.5px solid var(--dd-border)",
      }}
    >
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 hairline pt-[68px]">
          {/* Logo */}
          <div className="md:col-span-5">
            <AmaraLogo variant="dark" size="md" />
            <p
              className="mt-6 font-serif italic text-[20px] leading-snug"
              style={{ color: "rgba(240,235,224,0.72)", maxWidth: 340 }}
            >
              Private African journeys.
              <br />
              Crafted for the Gulf.
            </p>
          </div>

          {/* Journeys */}
          <div className="md:col-span-3">
            <p className="label mb-5">Journeys</p>
            <ul className="flex flex-col gap-[10px]">
              {JOURNEY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-serif italic text-[18px] leading-snug transition-colors duration-300 hover:text-[color:var(--dd-gold)]"
                    style={{ color: "rgba(200,192,170,0.55)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div className="md:col-span-2">
            <p className="label mb-5">Discover</p>
            <ul className="flex flex-col gap-[10px]">
              {DISCOVER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-serif italic text-[18px] leading-snug transition-colors duration-300 hover:text-[color:var(--dd-gold)]"
                    style={{ color: "rgba(200,192,170,0.55)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div className="md:col-span-2">
            <p className="label mb-5">Offices</p>
            <ul className="flex flex-col gap-4">
              {OFFICES.map((o) => (
                <li key={o.city}>
                  <p
                    className="font-serif italic text-[18px] leading-snug"
                    style={{ color: "var(--dd-linen)" }}
                  >
                    {o.city}
                  </p>
                  <p
                    className="text-[12px] leading-relaxed mt-1"
                    style={{
                      color: "var(--dd-stone)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {o.line1}
                    <br />
                    {o.line2}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="label mb-3">WhatsApp</p>
              <a
                href="https://wa.me/971588585960"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif italic text-[18px] leading-snug transition-colors duration-300 hover:text-[color:var(--dd-gold)]"
                style={{ color: "rgba(200,192,170,0.55)" }}
              >
                +971 58 858 5960
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-[84px] hairline pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="label" style={{ color: "var(--dd-stone)" }}>
            © {new Date().getFullYear()} Amara Africa · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            <button
              className="text-[11px] uppercase tracking-[0.3em] transition-colors duration-300"
              style={{ color: "var(--dd-gold)" }}
              aria-pressed="true"
            >
              English
            </button>
            <span
              className="block w-px h-[10px]"
              style={{ background: "rgba(200,185,150,0.22)" }}
              aria-hidden
            />
            <button
              className="text-[11px] uppercase tracking-[0.3em] transition-colors duration-300 hover:text-[color:var(--dd-gold)]"
              style={{ color: "var(--dd-stone)" }}
              lang="ar"
              dir="rtl"
            >
              العربية
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
