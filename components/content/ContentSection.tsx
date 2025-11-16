import { MDXRemote } from "next-mdx-remote/rsc";
import type { FAQData, TocItem } from "@/lib/homepage/types";
import { TableOfContents } from "./TableOfContents";
import { FAQList } from "./FaqList";

interface ContentSectionProps {
  content: string;
  toc: TocItem[];
  faq: FAQData;
}

export function ContentSection({ content, toc, faq }: ContentSectionProps) {
  return (
    <section className="card">
      <TableOfContents items={toc} />
      <div className="mdx-content">
        {/* mdx rendering */}
        {/* @ts-expect-error - RSC component */}
        <MDXRemote source={content} />
      </div>
      <FAQList faq={faq} />
    </section>
  );
}
