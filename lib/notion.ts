const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const CLIENT_REGISTER_DB = "32d8e3e04cde8093afbee879f5a7ce2b";
const DEADLINES_DB = "25a14ed22b2044a6921282ada8705a8e";

function notionHeaders() {
  const token = process.env.NOTION_TOKEN?.trim();
  if (!token) throw new Error("NOTION_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

export interface NotionClient {
  id: string;
  name: string;
  contact: string;
  email: string;
  entityType: string;
  services: string[];
  reminders: boolean;
  fye: string;
  vatNo: string;
  regNo?: string;
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

      const reminders = (props["Client Reminders"] as { checkbox?: boolean })?.checkbox ?? false;
      const fye = (props["FYE"] as { select?: { name: string } })?.select?.name ?? "";
      const vatNoArr = (props["VAT No"] as { rich_text?: { plain_text: string }[] })?.rich_text ?? [];
      const vatNo = vatNoArr[0]?.plain_text ?? "";

      return { id: page.id as string, name, contact, email, entityType, services, reminders, fye, vatNo };
    })
    .filter((c) => c.email && c.name);
}

// Returns Active clients with Client Reminders = true, for the deadline reminder cron
export async function getClientsForReminders(): Promise<NotionClient[]> {
  const res = await fetch(`${NOTION_API}/databases/${CLIENT_REGISTER_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Status", status: { equals: "Active" } },
          { property: "Client Reminders", checkbox: { equals: true } },
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
      const fye = (props["FYE"] as { select?: { name: string } })?.select?.name ?? "";
      const vatNoArr = (props["VAT No"] as { rich_text?: { plain_text: string }[] })?.rich_text ?? [];
      const vatNo = vatNoArr[0]?.plain_text ?? "";

      return { id: page.id as string, name, contact, email, entityType, services, reminders: true, fye, vatNo };
    })
    .filter((c) => c.email && c.name);
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

// ── Shared helpers (unexported) ───────────────────────────────────────────────

async function resolveClientNames(pages: Record<string, unknown>[]): Promise<Record<string, string>> {
  const ids = new Set<string>();
  for (const page of pages) {
    const rel = ((page.properties as Record<string, unknown>)["Client"] as { relation?: { id: string }[] })?.relation ?? [];
    if (rel[0]?.id) ids.add(rel[0].id);
  }
  const names: Record<string, string> = {};
  await Promise.all(Array.from(ids).map(async (id) => {
    const r = await fetch(`${NOTION_API}/pages/${id}`, { headers: notionHeaders() });
    if (!r.ok) return;
    const p = await r.json();
    const t = (p.properties["Client Name"] as { title?: { plain_text: string }[] })?.title ?? [];
    names[id] = t[0]?.plain_text ?? "Unknown Client";
  }));
  return names;
}

function pageToDeadline(page: Record<string, unknown>, clientNames: Record<string, string>): NotionDeadline {
  const props = page.properties as Record<string, unknown>;
  const taskName = ((props["Task Name"] as { title?: { plain_text: string }[] })?.title ?? [])[0]?.plain_text ?? "";
  const dueDate  = (props["Due Date"] as { date?: { start: string } })?.date?.start ?? "";
  const rel      = (props["Client"] as { relation?: { id: string }[] })?.relation ?? [];
  const clientId = rel[0]?.id ?? "";
  return {
    id:         page.id as string,
    taskName,
    dueDate,
    clientName: clientId ? (clientNames[clientId] ?? "Unknown") : "—",
    taskType:   (props["Task Type"] as { select?: { name: string } })?.select?.name ?? "",
    priority:   (props["Priority"]  as { select?: { name: string } })?.select?.name ?? "",
    status:     (props["Status"]    as { select?: { name: string } })?.select?.name ?? "",
  };
}

// ── Monthly-summary query helpers ─────────────────────────────────────────────

// Tasks with due date in [start, end] ISO strings — caller filters by status
export async function getTasksInDateRange(start: string, end: string): Promise<NotionDeadline[]> {
  const res = await fetch(`${NOTION_API}/databases/${DEADLINES_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Due Date", date: { on_or_after: start } },
          { property: "Due Date", date: { on_or_before: end } },
        ],
      },
      sorts: [{ property: "Due Date", direction: "ascending" }],
    }),
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const pages = data.results as Record<string, unknown>[];
  const clientNames = await resolveClientNames(pages);
  return pages.map(p => pageToDeadline(p, clientNames)).filter(d => d.taskName && d.dueDate);
}

// Tasks past due date that are not completed
export async function getOverdueTasksAll(): Promise<NotionDeadline[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().split("T")[0];

  const res = await fetch(`${NOTION_API}/databases/${DEADLINES_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: { property: "Due Date", date: { on_or_before: yesterdayIso } },
      sorts: [{ property: "Due Date", direction: "ascending" }],
    }),
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const pages = data.results as Record<string, unknown>[];
  const clientNames = await resolveClientNames(pages);
  return pages
    .map(p => pageToDeadline(p, clientNames))
    .filter(d => d.taskName && d.dueDate && d.status !== "\u{1F7E2} Completed");
}

// Active clients created on or after a given ISO datetime string
export async function getClientsCreatedSince(since: string): Promise<NotionClient[]> {
  const res = await fetch(`${NOTION_API}/databases/${CLIENT_REGISTER_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Status", status: { equals: "Active" } },
          { timestamp: "created_time", created_time: { on_or_after: since } },
        ],
      },
    }),
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.results as Record<string, unknown>[]).map((page) => {
    const props = page.properties as Record<string, unknown>;
    const name    = ((props["Client Name"] as { title?: { plain_text: string }[] })?.title ?? [])[0]?.plain_text ?? "";
    const contact = ((props["Contact"] as { rich_text?: { plain_text: string }[] })?.rich_text ?? [])[0]?.plain_text ?? "";
    const email   = (props["Email"] as { email?: string })?.email ?? "";
    const entityType = (props["Entity Type"] as { select?: { name: string } })?.select?.name ?? "";
    const services   = ((props["Services"] as { multi_select?: { name: string }[] })?.multi_select ?? []).map(s => s.name);
    const fye        = (props["FYE"] as { select?: { name: string } })?.select?.name ?? "";
    const vatNo      = ((props["VAT No"] as { rich_text?: { plain_text: string }[] })?.rich_text ?? [])[0]?.plain_text ?? "";
    return { id: page.id as string, name, contact, email, entityType, services, reminders: false, fye, vatNo };
  }).filter(c => c.name);
}

// Tasks due within the next N days, not completed
export async function getUpcomingDeadlinesN(days: number): Promise<NotionDeadline[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + days);
  const todayIso  = today.toISOString().split("T")[0];
  const cutoffIso = cutoff.toISOString().split("T")[0];

  const res = await fetch(`${NOTION_API}/databases/${DEADLINES_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Due Date", date: { on_or_after: todayIso } },
          { property: "Due Date", date: { on_or_before: cutoffIso } },
        ],
      },
      sorts: [{ property: "Due Date", direction: "ascending" }],
    }),
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const pages = data.results as Record<string, unknown>[];
  const clientNames = await resolveClientNames(pages);
  return pages
    .map(p => pageToDeadline(p, clientNames))
    .filter(d => d.taskName && d.dueDate && d.status !== "\u{1F7E2} Completed");
}

// ─────────────────────────────────────────────────────────────────────────────

// Returns tasks due within the next 3 days (and overdue) that are not Completed
export async function getUpcomingDeadlines(): Promise<NotionDeadline[]> {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + 3);

  // Include overdue tasks (past 7 days) up to 3 days ahead
  const floor = new Date(today);
  floor.setDate(today.getDate() - 7);

  const res = await fetch(`${NOTION_API}/databases/${DEADLINES_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Due Date", date: { on_or_after: floor.toISOString().split("T")[0] } },
          { property: "Due Date", date: { on_or_before: cutoff.toISOString().split("T")[0] } },
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
    .filter((d) => d.taskName && d.dueDate && d.status !== "\u{1F7E2} Completed");
}

export interface NotionTask {
  id: string;
  dueDate: string;
  status: string;
}

// Returns all tasks that have a Due Date (paginated), for status auto-update
export async function getTasksForStatusUpdate(): Promise<NotionTask[]> {
  const all: NotionTask[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filter: { property: "Due Date", date: { is_not_empty: true } },
      page_size: 100,
    };
    if (cursor) body.start_cursor = cursor;

    const res = await fetch(`${NOTION_API}/databases/${DEADLINES_DB}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
    const data = await res.json();

    for (const page of data.results as Record<string, unknown>[]) {
      const props = page.properties as Record<string, unknown>;
      const dueDate = (props["Due Date"] as { date?: { start: string } })?.date?.start ?? "";
      const status = (props["Status"] as { select?: { name: string } })?.select?.name ?? "";
      if (dueDate) all.push({ id: page.id as string, dueDate, status });
    }

    cursor = data.has_more ? (data.next_cursor as string) : undefined;
  } while (cursor);

  return all;
}

// Updates the Status select field on a Notion task page
export async function updateTaskStatus(pageId: string, status: string): Promise<void> {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({ properties: { Status: { select: { name: status } } } }),
  });
  if (!res.ok) throw new Error(`Notion update ${res.status}: ${await res.text()}`);
}

// Active clients where Welcome Sent = true and Engagement Sent = false
export async function getClientsForEngagement(): Promise<NotionClient[]> {
  const res = await fetch(`${NOTION_API}/databases/${CLIENT_REGISTER_DB}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        and: [
          { property: "Status",          status:   { equals: "Active" } },
          { property: "Welcome Sent",    checkbox: { equals: true     } },
          { property: "Engagement Sent", checkbox: { equals: false    } },
        ],
      },
    }),
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.results as Record<string, unknown>[]).map((page) => {
    const props = page.properties as Record<string, unknown>;
    const name    = ((props["Client Name"] as { title?: { plain_text: string }[] })?.title ?? [])[0]?.plain_text ?? "";
    const contact = ((props["Contact"]     as { rich_text?: { plain_text: string }[] })?.rich_text ?? [])[0]?.plain_text ?? "";
    const email   = (props["Email"]        as { email?: string })?.email ?? "";
    const entityType = (props["Entity Type"] as { select?: { name: string } })?.select?.name ?? "";
    const services   = ((props["Services"]   as { multi_select?: { name: string }[] })?.multi_select ?? []).map(s => s.name);
    const fye        = (props["FYE"]         as { select?: { name: string } })?.select?.name ?? "";
    const vatNo      = ((props["VAT No"]     as { rich_text?: { plain_text: string }[] })?.rich_text ?? [])[0]?.plain_text ?? "";
    const regNo      = ((props["Reg No."]    as { rich_text?: { plain_text: string }[] })?.rich_text ?? [])[0]?.plain_text ?? "";
    return { id: page.id as string, name, contact, email, entityType, services, reminders: false, fye, vatNo, regNo };
  }).filter(c => c.email && c.name);
}

// Marks Engagement Sent = true on a Notion page
export async function markEngagementSent(pageId: string): Promise<void> {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({ properties: { "Engagement Sent": { checkbox: true } } }),
  });
  if (!res.ok) throw new Error(`Notion update ${res.status}: ${await res.text()}`);
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
