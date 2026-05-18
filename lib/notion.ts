const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const CLIENT_REGISTER_DB = "32d8e3e04cde8093afbee879f5a7ce2b";
const DEADLINES_DB = "25a14ed22b2044a6921282ada8705a8e";

function notionHeaders() {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

export interface NotionClient {
  id: string;
  name: string;       // Client Name (entity/company)
  contact: string;    // Contact (person's name)
  email: string;
  entityType: string;
  services: string[];
}

// Returns Active clients where Welcome Sent checkbox is false
export async function getNewClients(): Promise<NotionClient[]> {
  const res = await fetch(`${NOTION_API}/databases/${CLIENT_REGISTER_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Status", status: { equals: "Active" } },
          { property: "Welcome Sent", checkbox: { equals: false } },
        ],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion query ${res.status}: ${text}`);
  }

  const data = await res.json();

  return (data.results as Record<string, unknown>[])
    .map((page) => {
      const props = page.properties as Record<string, unknown>;

      const titleArr = (props["Client Name"] as { title?: { plain_text: string }[] })?.title ?? [];
      const name = titleArr[0]?.plain_text ?? "";

      const contactArr = (props["Contact"] as { rich_text?: { plain_text: string }[] })?.rich_text ?? [];
      const contact = contactArr[0]?.plain_text ?? "";

      const email = (props["Email"] as { email?: string })?.email ?? "";

      const entityType = (props["Entity Type"] as { select?: { name: string } })?.select?.name ?? "";

      const servicesArr = (props["Services"] as { multi_select?: { name: string }[] })?.multi_select ?? [];
      const services = servicesArr.map((s) => s.name);

      return { id: page.id as string, name, contact, email, entityType, services };
    })
    .filter((c) => c.email && c.name); // skip records missing email or name
}

export interface NotionDeadline {
  id: string;
  taskName: string;
  dueDate: string;
  clientName: string;
  taskType: string;
  priority: string;
  status: string;
}

// Returns tasks due within the next 3 days (and overdue) that are not Completed
export async function getUpcomingDeadlines(): Promise<NotionDeadline[]> {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + 3);

  const res = await fetch(`${NOTION_API}/databases/${DEADLINES_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Due Date", date: { on_or_before: cutoff.toISOString().split("T")[0] } },
          { property: "Status", select: { does_not_equal: "🟢 Completed" } },
        ],
      },
      sorts: [{ property: "Due Date", direction: "ascending" }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion deadlines query ${res.status}: ${text}`);
  }

  const data = await res.json();
  const pages = data.results as Record<string, unknown>[];

  // Collect unique client page IDs to resolve names in one pass
  const clientIdSet = new Set<string>();
  for (const page of pages) {
    const props = page.properties as Record<string, unknown>;
    const rel = (props["Client"] as { relation?: { id: string }[] })?.relation ?? [];
    if (rel[0]?.id) clientIdSet.add(rel[0].id);
  }

  const clientNames: Record<string, string> = {};
  await Promise.all(
    Array.from(clientIdSet).map(async (clientId) => {
      const r = await fetch(`${NOTION_API}/pages/${clientId}`, { headers: notionHeaders() });
      if (!r.ok) return;
      const p = await r.json();
      const props = p.properties as Record<string, unknown>;
      const titleArr = (props["Client Name"] as { title?: { plain_text: string }[] })?.title ?? [];
      clientNames[clientId] = titleArr[0]?.plain_text ?? "Unknown Client";
    })
  );

  return pages
    .map((page) => {
      const props = page.properties as Record<string, unknown>;

      const titleArr = (props["Task Name"] as { title?: { plain_text: string }[] })?.title ?? [];
      const taskName = titleArr[0]?.plain_text ?? "";

      const dueDate = (props["Due Date"] as { date?: { start: string } })?.date?.start ?? "";

      const rel = (props["Client"] as { relation?: { id: string }[] })?.relation ?? [];
      const clientId = rel[0]?.id ?? "";
      const clientName = clientId ? (clientNames[clientId] ?? "Unknown") : "—";

      const taskType = (props["Task Type"] as { select?: { name: string } })?.select?.name ?? "";
      const priority = (props["Priority"] as { select?: { name: string } })?.select?.name ?? "";
      const status = (props["Status"] as { select?: { name: string } })?.select?.name ?? "";

      return { id: page.id as string, taskName, dueDate, clientName, taskType, priority, status };
    })
    .filter((d) => d.taskName && d.dueDate);
}

// Marks Welcome Sent = true on a Notion page
export async function markWelcomeSent(pageId: string): Promise<void> {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({
      properties: {
        "Welcome Sent": { checkbox: true },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion update ${res.status}: ${text}`);
  }
}
