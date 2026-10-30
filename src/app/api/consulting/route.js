import { deliverWithFormspree } from "@/lib/formspree";

function getText(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request) {
  let values;

  try {
    values = await request.json();
  } catch {
    return Response.json({ success: false, message: "Please check the form and try again." }, { status: 400 });
  }

  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return Response.json({ success: false, message: "Please check the form and try again." }, { status: 400 });
  }

  const name = getText(values.name, 100);
  const email = getText(values.email, 254);
  const company = getText(values.company, 140);
  const service = getText(values.service, 120);
  const budget = getText(values.budget, 100);
  const timeline = getText(values.timeline, 120);
  const details = getText(values.details, 4000);
  const website = getText(values.website, 200);

  if (website) {
    return Response.json({ success: true });
  }

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !service || !details) {
    return Response.json(
      { success: false, message: "Please provide your name, a valid email, a focus, and project details." },
      { status: 400 },
    );
  }

  const delivery = await deliverWithFormspree({
    name,
    email,
    company,
    service,
    budget,
    timeline,
    message: details,
    _subject: `Consulting inquiry: ${service}`,
    _gotcha: "",
  }, request.headers.get("origin"));

  if (!delivery.success) {
    return Response.json({ success: false, message: delivery.message }, { status: delivery.status });
  }

  return Response.json({ success: true });
}
