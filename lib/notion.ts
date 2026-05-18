const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

// Sikatrix HQ — Client Register database ID
const CLIENT_REGISTER_DB = "32d8e3e04cde8093afbee879f5a7ce2b";

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
