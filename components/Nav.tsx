"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
const NAV_LINKS = [
  { href: "/journeys", label: "Journeys" },
  { href: "/the-experience", label: "The Experience" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquireHover, setEnquireHover] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Link colour by state
  const linkColor = scrolled
    ? "rgba(200,192,170,0.7)" // cream @ 0.7
    : "#FFFFFF";

  // Outline enquire button by state
  const enquireBorder = scrolled
    ? "rgba(200,185,150,0.4)"
    : enquireHover
    ? "#D4AA68"
    : "rgba(255,255,255,0.6)";
  const enquireColor = scrolled
    ? "var(--dd-linen)"
    : enquireHover
    ? "#D4AA68"
    : "#FFFFFF";

  // Hamburger bar colour — always readable on hero
  const barColor = "#FFFFFF";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter,border-color] duration-500"
        style={{
          background: scrolled
            ? "rgba(13,13,11,0.95)"
            : "linear-gradient(to bottom, rgba(13,13,11,0.55) 0%, rgba(13,13,11,0) 100%)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "0.5px solid rgba(200,185,150,0.15)"
            : "0.5px solid transparent",
        }}
      >
        <nav className="flex items-center justify-between h-[110px] px-[20px] md:px-[36px]">
          {/* Desktop: logo left */}
          <div className="hidden md:block">
            <Link href="/">
              <NavLogo />
            </Link>
          </div>

          {/* Desktop: nav centre */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-[12px] uppercase tracking-[0.3em] transition-all duration-500 ${
                    scrolled ? "" : "opacity-[0.85] hover:opacity-100"
                  }`}
                  style={{ color: linkColor }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: enquire right */}
          <div className="hidden md:block">
            <Link
              href="/enquire"
              onMouseEnter={() => setEnquireHover(true)}
              onMouseLeave={() => setEnquireHover(false)}
              className="inline-block px-[18px] py-[8px] text-[11px] uppercase tracking-[0.28em] transition-colors duration-500"
              style={{
                border: `0.5px solid ${enquireBorder}`,
                color: enquireColor,
              }}
            >
              Enquire Privately
            </Link>
          </div>

          {/* Mobile: centred logo */}
          <div className="md:hidden flex-1 flex justify-center">
            <Link href="/">
              <NavLogo />
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden absolute right-[20px] top-1/2 -translate-y-1/2 w-8 h-8 flex flex-col items-end justify-center gap-[6px]"
          >
            <span
              className="block h-[1px] w-7 transition-transform duration-500"
              style={{
                background: menuOpen ? "var(--dd-ink)" : barColor,
                transform: menuOpen
                  ? "translateY(4px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block h-[1px] w-5 transition-transform duration-500"
              style={{
                background: menuOpen ? "var(--dd-ink)" : barColor,
                transform: menuOpen
                  ? "translateY(-3px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 menu-fade-in"
          style={{ background: "var(--dd-warm-white)" }}
        >
          <div className="section-x h-full flex flex-col pt-[110px] pb-12">
            <ul className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <li
                  key={l.href}
                  className="py-5"
                  style={{
                    borderBottom: "0.5px solid var(--dd-border)",
                  }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif italic text-[40px] leading-none"
                    style={{ color: "var(--dd-ink)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li
                className="py-5"
                style={{ borderBottom: "0.5px solid var(--dd-border)" }}
              >
                <Link
                  href="/enquire"
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-[40px] leading-none"
                  style={{ color: "var(--dd-ink)" }}
                >
                  <span className="italic">Enquire </span>
                  <span
                    className="italic"
                    style={{ color: "var(--dd-gold-antique)" }}
                  >
                    Privately
                  </span>
                </Link>
              </li>
            </ul>

            <div className="mt-8">
              <Link
                href="/enquire"
                onClick={() => setMenuOpen(false)}
                className="inline-block px-[20px] py-[10px] text-[11px] uppercase tracking-[0.28em]"
                style={{
                  border: "0.5px solid var(--dd-gold-antique)",
                  color: "var(--dd-gold-antique)",
                }}
              >
                Request Private Access
              </Link>
            </div>

            <div className="mt-auto">
              <div
                className="pt-5"
                style={{ borderTop: "0.5px solid var(--dd-border)" }}
              >
                <p className="label">Amara Africa · Est. 2025</p>
                <p className="label mt-2">Dubai · George · Cape Town</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLogo() {
  return (
    <span
      className="inline-flex flex-col items-center text-center"
      aria-label="Amara Africa"
    >
      <span
        className="block"
        style={{
          fontFamily: "var(--font-cursive)",
          fontSize: 48,
          lineHeight: 0.9,
          color: "#C8962E",
          letterSpacing: "-0.01em",
        }}
      >
        Amara
      </span>
      <span
        className="block mt-[3px] uppercase"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: "0.52em",
          paddingLeft: "0.52em",
          color: "#EDE8DC",
          lineHeight: 1,
        }}
      >
        Africa
      </span>
      <span
        className="block mt-[4px]"
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: "var(--font-arabic)",
          fontSize: 9,
          color: "rgba(200,150,46,0.7)",
          lineHeight: 1.2,
        }}
      >
        أَمَارَا وَ أَفْرِيقَا
      </span>
    </span>
  );
}
