import { randomUUID } from "node:crypto";
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
  const recommendation = getText(values.recommendation, 3000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !recommendation) {
    return Response.json({ success: false, message: "Please provide your name, a valid email, and a recommendation." }, { status: 400 });
  }

  const delivery = await deliverWithFormspree({
    name,
    email,
    recommendation,
    _subject: "Portfolio recommendation",
    _gotcha: "",
  }, request.headers.get("origin"));

  if (!delivery.success) {
    return Response.json({ success: false, message: delivery.message }, { status: delivery.status });
  }

  return Response.json({
    success: true,
    recommendation: {
      id: randomUUID(),
      name,
      recommendation,
    },
  });
}
