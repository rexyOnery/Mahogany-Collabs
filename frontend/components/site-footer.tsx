import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      ["Collections", "/collections"],
      ["Advanced Search", "/advanced-search"],
      ["Browse by Topic", "/explore"],
      ["New Additions", "/advanced-search"],
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
    <footer className="site-footer matched-site-footer">
      <div className="matched-footer-main">
        <section className="matched-footer-identity" aria-label="Mahogany Archives">
          <Link className="matched-footer-logo" href="/" aria-label="Mahogany Archives home">
            <Image
              className="matched-footer-brand-logo"
              src="/images/mahogany-archives/mahogany-logo-enhanced.png"
              alt="Mahogany Archives"
              width={1160}
              height={356}
            />
          </Link>

          <p className="matched-footer-tagline">
            Preserving the past.
            <br />
            Illuminating the present.
            <br />
            Inspiring the future.
          </p>

          <div className="matched-footer-socials" aria-label="Social media">
            <Link href="/community" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1Z" />
              </svg>
            </Link>
            <Link href="/community" aria-label="X">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4.4l3.5 5 4.3-5H20l-5.8 6.7L20.5 20H16l-4-5.8L7 20H4.2l6.5-7.5L5 4Zm3 2 9 12h1L9 6H8Z" />
              </svg>
            </Link>
            <Link href="/community" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 2A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8ZM17.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
              </svg>
            </Link>
            <Link href="/learn#events" aria-label="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
              </svg>
            </Link>
          </div>
        </section>

        {columns.map((column) => (
          <nav className="matched-footer-column" aria-label={column.title} key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map(([label, href]) => (
              <Link href={href} key={`${label}-${href}`}>
                {label}
              </Link>
            ))}
          </nav>
        ))}

        <section className="matched-footer-connect">
          <h2>Stay Connected</h2>
          <p>
            Get updates on new collections,
            <br />
            events, and stories.
          </p>
          <form className="matched-newsletter" action="/support" method="get">
            <label className="sr-only" htmlFor="footer-email">
              Enter your email
            </label>
            <input
              id="footer-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            <button type="submit" aria-label="Subscribe">
              →
            </button>
          </form>
        </section>
      </div>

      <div className="matched-footer-bottom">
        <p>© 2025 Mahogany Archives. All rights reserved.</p>
        <nav aria-label="Legal links">
          <Link href="/support#privacy">Privacy Policy</Link>
          <Link href="/support#terms">Terms of Use</Link>
          <Link href="/support#accessibility">Accessibility</Link>
          <Link href="/support">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}
