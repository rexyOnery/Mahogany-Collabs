import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Youtube } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      ["Collections", "/collections"],
      ["Advanced Search", "/advanced-search"],
      ["Browse by Topic", "/explore"],
      ["New Additions", "/collections"],
      ["Digital Exhibitions", "/learn#exhibitions"]
    ]
  },
  {
    title: "Learn",
    links: [
      ["Teaching Resources", "/learn#teaching"],
      ["Research Guides", "/learn#guides"],
      ["Webinars & Events", "/learn#events"],
      ["Blog", "/learn"],
      ["Help Center", "/support"]
    ]
  },
  {
    title: "Community",
    links: [
      ["Join the Community", "/community"],
      ["Member Directory", "/community#members"],
      ["Contribute", "/support#submit"],
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
      ["News", "/about"],
      ["Careers", "/about#careers"]
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="archive-container site-footer-shell">
        <div className="site-footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Mahogany Archives home">
              <span className="brand-mark" aria-hidden="true">
                M
              </span>
              <span className="brand-copy" aria-hidden="true">
                <strong>Mahogany</strong>
                <small>Archives</small>
              </span>
            </Link>
            <p>
              Preserving the past.
              <br />
              Illuminating the present.
              <br />
              Inspiring the future.
            </p>
            <div className="footer-socials" aria-label="Social links">
              <Link href="/community" aria-label="Facebook">
                <Facebook size={15} />
              </Link>
              <Link href="/community" aria-label="X">
                <span aria-hidden="true">𝕏</span>
              </Link>
              <Link href="/community" aria-label="Instagram">
                <Instagram size={15} />
              </Link>
              <Link href="/learn#events" aria-label="YouTube">
                <Youtube size={15} />
              </Link>
            </div>
          </div>

          {columns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map(([label, href]) => (
                  <li key={`${label}-${href}`}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <form className="footer-newsletter" action="/support" method="get">
            <label htmlFor="newsletter">Stay Connected</label>
            <p>Get updates on new collections, events, and stories.</p>
            <div>
              <input
                id="newsletter"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
              <button type="submit" aria-label="Subscribe">
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        </div>

        <div className="site-footer-bottom">
          <span>© 2025 Mahogany Archives. All rights reserved.</span>
          <div>
            <Link href="/support#privacy">Privacy Policy</Link>
            <Link href="/support#terms">Terms of Use</Link>
            <Link href="/support#accessibility">Accessibility</Link>
            <Link href="/support">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
