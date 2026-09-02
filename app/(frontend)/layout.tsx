import type { Metadata } from "next";
import { Archivo, Jost } from "next/font/google";
import { getPayload } from "payload";
import config from "@payload-config";
import { SiteHeader } from "@/components/blocks/SiteHeader";
import { SiteFooter } from "@/components/blocks/SiteFooter";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SocialLinksProvider } from "@/components/SocialLinksContext";
import "../globals.css";

// Placeholder for Roc Grotesk Wide 500 until the licensed font files are
// available. Archivo is a variable font with a width axis, stretched via
// CSS (.font-serif in globals.css) to approximate Roc Grotesk Wide's wide,
// grotesk character. The CSS variable name (--font-serif-display) predates
// this swap — it's just the Tailwind `font-serif` token's source, not a
// literal claim about the typeface. Swap this block for `next/font/local`
// pointing at the real files once you have them; nothing else changes.
const headingFont = Archivo({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
});

// Placeholder for Avenir Roman 400 until the licensed font files are
// available. Jost is the closest free match to Avenir's geometric, humanist
// proportions. Swap for `next/font/local` the same way as above.
const bodyFont = Jost({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "FAVLA — Transformamos territorios, vidas y futuros",
  description:
    "Creamos y ejecutamos oportunidades para la inclusión efectiva, el desarrollo sostenible y el fortalecimiento de programas que empoderan comunidades y territorios.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const payload = await getPayload({ config });
  const [header, footer] = await Promise.all([
    payload.findGlobal({ slug: "header" }),
    payload.findGlobal({ slug: "footer" }),
  ]);

  return (
    <html
      lang="es"
      data-theme-status="light"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the saved theme before paint, so there's no flash of the
            wrong theme on load. Runs inline (not a bundled script) precisely
            so it executes before hydration and before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme-status','dark');}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full bg-paper text-ink">
        <CustomCursor />
        <SiteHeader {...header} />
        <SocialLinksProvider links={footer.socialLinks}>{children}</SocialLinksProvider>
        <SiteFooter {...footer} />
      </body>
    </html>
  );
}
