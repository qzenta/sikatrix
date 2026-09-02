import { NextRequest, NextResponse } from "next/server";

// TEMP diagnostic route -- audits which databases the Notion integration
// token can actually see. Remove after use.

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.AUDIT_TOKEN || auth !== `Bearer ${process.env.AUDIT_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.NOTION_TOKEN?.trim();
  if (!token) return NextResponse.json({ error: "NOTION_TOKEN not set" }, { status: 500 });

  const results: { id: string; title: string; object: string }[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filter: { property: "object", value: "database" },
      page_size: 100,
    };
    if (cursor) body.start_cursor = cursor;

    const res = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Notion search ${res.status}: ${await res.text()}` }, { status: 500 });
    }

    const data = await res.json();
    for (const r of data.results as Record<string, unknown>[]) {
      const titleArr = (r.title as { plain_text?: string }[]) ?? [];
      const title = titleArr.map((t) => t.plain_text).join("") || "(untitled)";
      results.push({ id: (r.id as string).replace(/-/g, ""), title, object: r.object as string });
    }
    cursor = data.has_more ? (data.next_cursor as string) : undefined;
  } while (cursor);

  return NextResponse.json({ ok: true, count: results.length, databases: results });
}
