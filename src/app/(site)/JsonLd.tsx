import { jsonLdString } from "@/lib/seo";

/** Renders a schema.org JSON-LD block (server component, so it is in the initial HTML for crawlers). */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
