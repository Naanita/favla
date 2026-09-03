import { TransitionLink } from "@/components/ui/TransitionLink";

export default function Page2() {
  return (
    <main className="favla-container flex min-h-[70vh] flex-col items-center justify-center gap-8 py-32 text-center">
      <h1 className="font-serif text-6xl text-ink">Page 2</h1>
      <TransitionLink
        href="/page1"
        className="favla-eyebrow rounded-full border border-line px-6 py-3 text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        Ir a Page 1
      </TransitionLink>
    </main>
  );
}
