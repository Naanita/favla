"use client";

import { useState } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { RenderBlocks } from "./RenderBlocks";
import { useLenis } from "@/hooks/useLenis";
import type { BlockData } from "@/lib/blockComponents";

type PageData = { layout?: BlockData[] | null };

function StaticPage({ page }: { page: PageData }) {
  useLenis();
  return (
    <main>
      <RenderBlocks layout={page.layout ?? []} />
    </main>
  );
}

function LivePreviewPage({ page }: { page: PageData }) {
  const { data } = useLivePreview({
    initialData: page,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
    depth: 2,
  });
  useLenis();
  return (
    <main>
      <RenderBlocks layout={data.layout ?? []} />
    </main>
  );
}

export function PageRenderer({ page }: { page: PageData }) {
  // useLivePreview posts/listens for messages from Payload's admin iframe on
  // every render, even outside of it — which caused unnecessary re-renders
  // (and, concretely, aborted the hero's in-flight video request) on the
  // plain public site. Only mount it when we're actually embedded in the
  // Live Preview iframe; render statically everywhere else.
  const [inPreviewFrame] = useState(() => typeof window !== "undefined" && window.self !== window.top);

  return inPreviewFrame ? <LivePreviewPage page={page} /> : <StaticPage page={page} />;
}
