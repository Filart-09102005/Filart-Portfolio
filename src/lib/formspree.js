const FORM_ID_PATTERN = /^[a-zA-Z0-9-]+$/;

export async function deliverWithFormspree(fields, origin) {
  const formId = process.env.FORMSPREE_FORM_ID?.trim();

  if (!formId || !FORM_ID_PATTERN.test(formId)) {
    return {
      success: false,
      status: 503,
      message: "Email delivery isn’t configured yet. Please email me directly.",
    };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(origin ? { Origin: origin } : {}),
      },
      body: JSON.stringify(fields),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    const accepted = response.ok && result.ok !== false && result.success !== false;

    if (!accepted) {
      const fieldErrors = Array.isArray(result.errors)
        ? result.errors.map((error) => error.message).filter(Boolean).join(" ")
        : "";
      const message = fieldErrors || result.error || result.message;

      return {
        success: false,
        status: response.status || 502,
        message: typeof message === "string" && message.trim()
          ? message.trim()
          : "The email service could not accept the submission. Please try again or email me directly.",
      };
    }

    return { success: true, status: 200 };
  } catch {
    return {
      success: false,
      status: 502,
      message: "The email service could not be reached. Please try again in a moment.",
    };
  }
}
