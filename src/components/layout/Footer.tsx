import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";
import { coreServices } from "@/lib/content";
import { site } from "@/lib/site";

const company = [
  { label: "Why Daddy", href: "#why" },
  { label: "How we work", href: "#process" },
  { label: "Solana & Web3", href: "#solana" },
  { label: "Tech stack", href: "#stack" },
  { label: "Start a project", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-bone/8 bg-ink-900/40">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-mute">
              End-to-end software development, cloud and Solana engineering. You
              bring the idea — we build, ship and maintain the thing.
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="font-mono text-[0.68rem] tracking-[0.2em] text-bone-dim uppercase">
              Services
            </h2>
            <ul className="mt-5 space-y-2.5">
              {coreServices.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-[0.92rem] text-mute transition-colors hover:text-bone"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="font-mono text-[0.68rem] tracking-[0.2em] text-bone-dim uppercase">
              Company
            </h2>
            <ul className="mt-5 space-y-2.5">
              {company.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[0.92rem] text-mute transition-colors hover:text-bone"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.68rem] tracking-[0.2em] text-bone-dim uppercase">
              Contact
            </h2>
            <ul className="mt-5 space-y-2.5 text-[0.92rem]">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-brass hover:underline"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-bone/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.72rem] text-mute">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="font-mono text-[0.72rem] text-mute/70">
            Yes, we chose the name on purpose. No, it doesn&rsquo;t affect the
            uptime.
          </p>
        </div>
      </Container>
    </footer>
  );
}
