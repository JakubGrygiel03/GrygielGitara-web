type UpsertBrevoContactInput = {
  email: string;
  firstName?: string;
  /** Only true when user gave explicit marketing consent (e.g. free guide). */
  addToMarketingList?: boolean;
  marketingConsent?: boolean;
};

/**
 * Adds/updates a contact in Brevo.
 * Marketing list is used only when addToMarketingList is true.
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

  const attributes: Record<string, string> = {};
  if (input.firstName?.trim()) {
    attributes.FIRSTNAME = input.firstName.trim();
  }
  if (input.marketingConsent) {
    attributes.MARKETING_CONSENT = "true";
  }

  const body: {
    email: string;
    updateEnabled: boolean;
    attributes?: Record<string, string>;
    listIds?: number[];
  } = {
    email: input.email,
    updateEnabled: true,
  };

  if (Object.keys(attributes).length > 0) {
    body.attributes = attributes;
  }

  if (
    input.addToMarketingList &&
    listId !== undefined &&
    Number.isFinite(listId)
  ) {
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

    if (response.ok || response.status === 204) {
      return;
    }

    const detail = await response.text();
    console.error("Brevo createContact failed:", response.status, detail);
  } catch (error) {
    console.error("Brevo createContact network error:", error);
  }
}
