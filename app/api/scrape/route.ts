// app/api/scrape/route.ts
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const response = await fetch(
      "https://www.solna.se/bygga-bo--miljo/avfall-och-atervinning/mobil-atervinningscentral-och-mobil-miljostation",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );
    const html = await response.text();

    const $ = cheerio.load(html);
    const table = $("#Tabelluddaveckor")
      .next(".sv-text-portlet-content")
      .find("table");

    // Remove all inline styles and classes
    table.removeAttr("style").removeAttr("class");
    table.find("*").removeAttr("style").removeAttr("class");

    // Remove caption
    table.find("caption").remove();

    // Remove <p> tags but keep their content
    table.find("p").each((_, el) => {
      const content = $(el).text();
      $(el).replaceWith(content);
    });

    const cleanTableHtml = table.prop("outerHTML");

    return NextResponse.json({ tableContent: cleanTableHtml });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
