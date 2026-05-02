import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png";

const FOOTER_LINKS = {
  marketplace: [
    { to: "/marketplace", label: "Browse Catalog" },
    { to: "/dashboard", label: "My Dashboard" },
    { to: "/teams", label: "Our Team" },
    { to: "/faq", label: "FAQ" },
  ],
  support: [
    { to: "/help", label: "Help Center" },
    { to: "/contact", label: "Contact Us" },
    {
      href: "https://wa.me/2347089454544",
      label: "WhatsApp Support",
      external: true,
    },
  ],
  legal: [
    { to: "/terms", label: "Terms of Service" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/cookies", label: "Cookie Policy" },
  ],
};

// Social SVG Icons
function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 
        5.373-12 12c0 5.99 4.388 10.954 10.125 
        11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 
        1.792-4.669 4.533-4.669 1.312 0 2.686.235 
        2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 
        1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 
        23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M18.244 2.25h3.308l-7.227 
        8.26 8.502 11.24H16.17l-5.214-6.817L4.99 
        21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 
        6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 
        3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 
        1.645.069 4.849 0 3.205-.012 3.584-.069 
        4.849-.149 3.225-1.664 4.771-4.919 
        4.919-1.266.058-1.644.07-4.85.07-3.204 
        0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 
        0-3.204.013-3.583.07-4.849.149-3.227 
        1.664-4.771 4.919-4.919 1.266-.057 
        1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 
        7.053.072 2.695.272.273 2.69.073 
        7.052.014 8.333 0 8.741 0 12c0 3.259.014 
        3.668.072 4.948.2 4.358 2.618 6.78 6.98 
        6.98C8.333 23.986 8.741 24 12 24c3.259 0 
        3.668-.014 4.948-.072 4.354-.2 6.782-2.618 
        6.979-6.98.059-1.28.073-1.689.073-4.948 
        0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 
        15.259 0 12 0zm0 5.838a6.162 6.162 0 100 
        12.324 6.162 6.162 0 000-12.324zM12 16a4 
        4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 
        1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      />
    </svg>
  );
}

function FooterLink({ to, href, label, external }) {
  const baseClass = `
    text-gray-400 hover:text-white text-sm
    flex items-center gap-2 group
    transition-all duration-200
  `;

  const arrow = (
    <span
      className="text-[#D4AF37] opacity-0
      group-hover:opacity-100 transition-opacity"
    >
      →
    </span>
  );

  if (external || href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {arrow} {label}
      </a>
    );
  }

  return (
    <Link to={to} className={baseClass}>
      {arrow} {label}
    </Link>
  );
}

export default function Footer() {
  const t = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#2C1F0E] text-white
      border-t-4 border-[#D4AF37] mt-16"
    >
      {/* ======================== */}
      {/* MAIN CONTENT             */}
      {/* ======================== */}
      <div className="container py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2
          lg:grid-cols-4 gap-12"
        >
          {/* ---- Brand Column ---- */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center
              gap-3 mb-5 group"
            >
              <img
                src={KOB_LOGO}
                alt="KOB"
                className="h-10 w-auto object-contain
                  group-hover:scale-105 transition-transform"
              />
              <div>
                <p
                  className="font-black text-[#D4AF37]
                  text-xl tracking-tight"
                >
                  KOB
                </p>
                <p
                  className="text-[9px] text-gray-400
                  uppercase tracking-widest font-bold"
                >
                  Marketplace
                </p>
              </div>
            </Link>

            <p
              className="text-gray-400 text-sm
              leading-relaxed mb-6 max-w-xs"
            >
              Katsina's premier online marketplace — connecting buyers and
              sellers across the state and beyond.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://web.facebook.com/profile.php?id=61582479357494"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full
                  bg-white/10 hover:bg-[#D4AF37]
                  flex items-center justify-center
                  transition-all duration-200"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full
                  bg-white/10 hover:bg-[#D4AF37]
                  flex items-center justify-center
                  transition-all duration-200"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full
                  bg-white/10 hover:bg-[#D4AF37]
                  flex items-center justify-center
                  transition-all duration-200"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* ---- Marketplace Column ---- */}
          <div>
            <h4
              className="text-sm font-black uppercase
              tracking-widest text-[#D4AF37] mb-5"
            >
              Marketplace
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.marketplace.map((link) => (
                <li key={link.to}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Support Column ---- */}
          <div>
            <h4
              className="text-sm font-black uppercase
              tracking-widest text-[#D4AF37] mb-5"
            >
              Support
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Legal Column ---- */}
          <div>
            <h4
              className="text-sm font-black uppercase
              tracking-widest text-[#D4AF37] mb-5"
            >
              Legal
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.to}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>

            {/* KOB Express CTA */}
            <div
              className="mt-8 p-4 bg-white/5
              rounded-2xl border border-white/10"
            >
              <p
                className="text-xs font-black
                text-[#D4AF37] uppercase tracking-wider mb-1"
              >
                🚚 KOB Express
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Fast delivery across Katsina State
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-white
                  bg-[#D4AF37]/20 hover:bg-[#D4AF37]
                  px-3 py-1.5 rounded-lg
                  transition-all duration-200 inline-block"
              >
                Book Delivery →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ======================== */}
      {/* BOTTOM BAR               */}
      {/* ======================== */}
      <div className="border-t border-white/10">
        <div
          className="container py-6 flex flex-col
          md:flex-row items-center justify-between gap-4"
        >
          <p
            className="text-gray-500 text-xs font-medium
            text-center md:text-left"
          >
            © {year} Katsina Online Business (KOB). All rights reserved.
          </p>

          <div
            className="flex items-center gap-4
            text-xs font-bold"
          >
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-[#D4AF37]
                transition-colors"
            >
              Privacy
            </Link>
            <span className="text-gray-700">·</span>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-[#D4AF37]
                transition-colors"
            >
              Terms
            </Link>
            <span className="text-gray-700">·</span>
            <Link
              to="/cookies"
              className="text-gray-500 hover:text-[#D4AF37]
                transition-colors"
            >
              Cookies
            </Link>
          </div>

          <p className="text-gray-600 text-xs font-medium">
            Made with ❤️ in Katsina, Nigeria 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
}
