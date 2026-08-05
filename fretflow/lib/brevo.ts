type UpsertBrevoContactInput = {
  email: string;
  firstName?: string;
};

/**
 * Adds/updates a contact in Brevo (free CRM / marketing list).
 * No-ops when BREVO_API_KEY is missing. Never throws to callers.
 */
export async function upsertBrevoContact(
  input: UpsertBrevoContactInput,
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.warn("Brevo skipped: set BREVO_API_KEY to sync newsletter contacts.");
    return;
  }

  const listIdRaw = process.env.BREVO_LIST_ID?.trim();
  const listId = listIdRaw ? Number(listIdRaw) : undefined;

  const body: {
    email: string;
    updateEnabled: boolean;
    attributes?: Record<string, string>;
    listIds?: number[];
  } = {
    email: input.email,
    updateEnabled: true,
  };

  if (input.firstName?.trim()) {
    body.attributes = { FIRSTNAME: input.firstName.trim() };
  }

  if (listId !== undefined && Number.isFinite(listId)) {
    body.listIds = [listId];
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // 201 created, 204 updated (with updateEnabled)
    if (response.ok || response.status === 204) {
      return;
    }

    const detail = await response.text();
    console.error("Brevo createContact failed:", response.status, detail);
  } catch (error) {
    console.error("Brevo createContact network error:", error);
  }
}
