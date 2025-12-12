import { NextResponse } from "next/server";
import { bangMap, defaultEngines, type DefaultEngineKey } from "@/data/bangs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function getUserDefaultEngine(request: Request) {
  const url = new URL(request.url);

  const param = url.searchParams.get("se")?.toLowerCase();
  if (param && param in defaultEngines) {
    return defaultEngines[param as DefaultEngineKey];
  }

  const header = request.headers.get("x-prefix-default-se")?.toLowerCase();
  if (header && header in defaultEngines) {
    return defaultEngines[header as DefaultEngineKey];
  }

  return defaultEngines.ddg;
}

async function getLuckyUrl(
  query: string,
  defaultEngineUrl: string,
): Promise<string> {
  const q = query.trim();
  if (!q) return new URL(defaultEngineUrl).origin;

  if (defaultEngineUrl.includes("duckduckgo.com")) {
    return `https://www.duckduckgo.com/lite/?q=${encodeURIComponent(q + " !ducky")}`;
  }

  if (defaultEngineUrl.includes("google.com")) {
    return `https://www.google.com/search?q=${encodeURIComponent(q)}&btnI=1`;
  }
  return defaultEngineUrl.replace("{{{s}}}", encodeURIComponent(q));
}

function buildUrl(template: string, q: string): string {
  return template.replace("{{{s}}}", encodeURIComponent(q || ""));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("q")?.trim() ?? "";

  const defaultEngine = getUserDefaultEngine(request);

  if (!raw) {
    return NextResponse.redirect(defaultEngine.d);
  }

  const lowerRaw = raw.toLowerCase();
  const duckyPrefix = lowerRaw.match(/^!\s/);

  const duckySuffix = lowerRaw.match(/\s!$/);

  const isLucky = duckyPrefix || duckySuffix;

  let queryForProcessing = raw;
  if (isLucky) {
    queryForProcessing = raw.replace(/^!\s/i, "").replace(/\s*!$/i, "").trim();
  }

  const bangMatch = queryForProcessing.match(
    /(?:^|\s)!(gt|[a-z0-9+-]{1,20})\b/i,
  );

  let bangTrigger: string | null = null;
  let searchTerm = queryForProcessing;

  if (bangMatch) {
    bangTrigger = bangMatch[1].toLowerCase();
    searchTerm = queryForProcessing.replace(bangMatch[0], "").trim();
  }

  if (bangTrigger && bangMap.has(bangTrigger)) {
    const bang = bangMap.get(bangTrigger)!;
    const target = buildUrl(bang.u, searchTerm);
    return NextResponse.redirect(target, { status: 307 });
  }

  if (isLucky) {
    const finalQuery = searchTerm || raw.trim();
    const luckyUrl = await getLuckyUrl(finalQuery, defaultEngine.u);
    return NextResponse.redirect(luckyUrl, { status: 307 });
  }

  const normalUrl = buildUrl(defaultEngine.u, raw);
  return NextResponse.redirect(normalUrl, { status: 307 });
}
