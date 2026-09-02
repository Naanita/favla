import { blockComponents, type BlockData } from "@/lib/blockComponents";

export function RenderBlocks({ layout }: { layout?: BlockData[] | null }) {
  return (
    <>
      {layout?.map((block, i) => {
        if (block.isVisible === false) return null;
        const Component = blockComponents[block.blockType];
        if (!Component) return null;
        return <Component key={block.id ?? i} {...block} />;
      })}
    </>
  );
}
