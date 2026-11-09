import { PortableText, type PortableTextBlock } from "@portabletext/react";
import type { Block } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RichText({
  value,
  className = "",
}: {
  value?: Block[] | null;
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div
      className={cn(
        "font-poppins space-y-4 leading-relaxed text-steel",
        className,
      )}
    >
      <PortableText
        value={value as unknown as PortableTextBlock[]}
        components={{
          block: {
            h2: ({ children }) => (
              <h2 className="pt-4 text-2xl font-bold text-ink">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="pt-2 text-xl font-bold text-ink">{children}</h3>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul className="list-disc space-y-1.5 pl-5">{children}</ul>
            ),
          },
        }}
      />
    </div>
  );
}
