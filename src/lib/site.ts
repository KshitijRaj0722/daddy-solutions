export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://daddysolutions.dev";

export const site = {
  name: "Daddy Solutions",
  legalName: "Daddy Solutions Labs",
  tagline: "You bring the idea. Daddy handles the rest.",
  description:
    "Daddy Solutions is an end-to-end software company. Full-stack web, APIs, databases, cloud, DevOps, Solana/Web3, automation and internal tools, and long-term maintenance — one senior team, from idea to production.",
  url: siteUrl,
  founded: "2019",
  contact: {
    email: "daddysolutions404@gmail.com",
  },
} as const;

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Why Daddy", href: "#why" },
  { label: "How we work", href: "#process" },
  { label: "Solana", href: "#solana" },
  { label: "Stack", href: "#stack" },
] as const;
