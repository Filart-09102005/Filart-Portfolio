import { randomUUID } from "node:crypto";
import { deliverWithFormspree } from "@/lib/formspree";
import { createPortfolioSupabaseClient } from "@/lib/portfolio-supabase";

const RECOMMENDATION_TABLE = "portfolio_recommendations";
const supabase = createPortfolioSupabaseClient({
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

function getText(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function GET() {
  if (!supabase) {
    return Response.json(
      { success: false, message: "Recommendations are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { data, error } = await supabase
    .from(RECOMMENDATION_TABLE)
    .select("id, name, recommendation, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json(
      { success: false, message: "Recommendations are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { success: true, recommendations: data ?? [] },
    { headers: { "Cache-Control": "no-store" } },
  );
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

  if (!supabase) {
    return Response.json(
      { success: false, message: "The recommendation could not be saved. Please try again later." },
      { status: 503 },
    );
  }

  const savedRecommendation = {
    id: randomUUID(),
    name,
    email,
    recommendation,
  };
  const { error: saveError } = await supabase
    .from(RECOMMENDATION_TABLE)
    .insert(savedRecommendation);

  if (saveError) {
    return Response.json(
      { success: false, message: "The recommendation could not be saved. Please try again later." },
      { status: 503 },
    );
  }

  const delivery = await deliverWithFormspree({
    name,
    email,
    recommendation,
    _subject: "Portfolio recommendation",
    _gotcha: "",
  }, request.headers.get("origin"));

  return Response.json({
    success: true,
    notificationSent: delivery.success,
    recommendation: {
      id: savedRecommendation.id,
      name,
      recommendation,
    },
  });
}
