import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, Youtube } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      ["Collections", "/collections"],
      ["Advanced Search", "/advanced-search"],
      ["Browse by Topic", "/explore"],
      ["Digital Exhibitions", "/learn#exhibitions"]
    ]
  },
  {
    title: "Learn",
    links: [
      ["Teaching Resources", "/learn#teaching"],
      ["Research Guides", "/learn#guides"],
      ["Webinars and Events", "/learn#events"],
      ["Help Center", "/support"]
    ]
  },
  {
    title: "Community",
    links: [
      ["Join the Community", "/community"],
      ["Member Directory", "/community#members"],
      ["Volunteer", "/support#volunteer"],
      ["Submit Materials", "/support#submit"]
    ]
  },
  {
    title: "About",
    links: [
      ["Our Mission", "/about"],
      ["Our Team", "/about#team"],
      ["Partners", "/about#partners"],
      ["Careers", "/about#careers"]
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link href="/" className="brand brand-footer">
          <Image
            src="/images/mahogany-logo.jpeg"
            alt="Mahogany Archives"
            width={260}
            height={260}
            className="brand-logo brand-logo-footer"
          />
        </Link>
        <p>Preserving the past. Illuminating the present. Inspiring the future.</p>
        <div className="social-row" aria-label="Social links">
          <Facebook size={18} />
          <Instagram size={18} />
          <Youtube size={18} />
          <Mail size={18} />
        </div>
      </div>

      {columns.map((column) => (
        <div className="footer-column" key={column.title}>
          <h3>{column.title}</h3>
          {column.links.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
      ))}

      <form className="newsletter-form">
        <label htmlFor="newsletter">Stay connected</label>
        <div>
          <input id="newsletter" type="email" placeholder="Enter your email" />
          <button type="submit" aria-label="Subscribe">
            <Mail size={16} />
          </button>
        </div>
      </form>

      <div className="footer-bottom">
        <span>2026 Mahogany Archives. All rights reserved.</span>
        <Link href="/support#privacy">Privacy Policy</Link>
        <Link href="/support#terms">Terms of Use</Link>
        <Link href="/support#accessibility">Accessibility</Link>
      </div>
    </footer>
  );
}
