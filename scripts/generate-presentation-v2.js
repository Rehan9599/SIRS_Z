const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "ReadyCool Team";
pptx.company = "SIRS_Z";
pptx.subject = "ReadyCool Class Presentation v2";
pptx.title = "ReadyCool - Class Presentation v2";
pptx.lang = "en-US";

const C = {
  bg: "F4F7FB",
  ink: "0B132B",
  text: "1E293B",
  muted: "64748B",
  accentA: "0EA5E9",
  accentB: "22C55E",
  accentC: "F59E0B",
  accentD: "EF4444",
  white: "FFFFFF",
  panel: "FFFFFF",
  line: "D9E2F1",
  dark: "0A2540",
};

function topBand(s, slideNo) {
  s.background = { color: C.bg };
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.32,
    fill: { color: C.dark },
    line: { color: C.dark },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 9.9,
    y: 0,
    w: 1.1,
    h: 0.32,
    fill: { color: C.accentA },
    line: { color: C.accentA },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 11,
    y: 0,
    w: 1.1,
    h: 0.32,
    fill: { color: C.accentB },
    line: { color: C.accentB },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 12.1,
    y: 0,
    w: 1.23,
    h: 0.32,
    fill: { color: C.accentC },
    line: { color: C.accentC },
  });

  s.addText("READYCOOL", {
    x: 0.7,
    y: 0.46,
    w: 3.3,
    h: 0.25,
    fontFace: "Aptos Display",
    fontSize: 12,
    bold: true,
    color: C.dark,
    charSpace: 1,
  });

  s.addText(String(slideNo), {
    x: 12.45,
    y: 7.0,
    w: 0.6,
    h: 0.24,
    fontFace: "Aptos",
    fontSize: 10,
    color: "94A3B8",
    align: "right",
  });
}

function titleBlock(s, eyebrow, title, subtitle) {
  s.addText(eyebrow, {
    x: 0.7,
    y: 0.9,
    w: 8.5,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 12,
    bold: true,
    color: C.accentA,
    charSpace: 1,
  });
  s.addText(title, {
    x: 0.7,
    y: 1.18,
    w: 11.5,
    h: 0.56,
    fontFace: "Aptos Display",
    fontSize: 34,
    bold: true,
    color: C.ink,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.72,
      y: 1.73,
      w: 11,
      h: 0.34,
      fontFace: "Aptos",
      fontSize: 14,
      color: C.muted,
    });
  }
}

function panel(s, x, y, w, h, title, bullets, color = C.panel) {
  s.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    radius: 0.08,
    fill: { color },
    line: { color: C.line, pt: 1 },
    shadow: { type: "outer", color: "C7D2E5", blur: 3, angle: 45, distance: 1.2, opacity: 0.16 },
  });
  if (title) {
    s.addText(title, {
      x: x + 0.22,
      y: y + 0.16,
      w: w - 0.4,
      h: 0.34,
      fontFace: "Aptos",
      fontSize: 16,
      bold: true,
      color: C.dark,
    });
  }
  if (bullets && bullets.length) {
    s.addText(
      bullets.map((t) => ({ text: t, options: { bullet: { indent: 16 } } })),
      {
        x: x + 0.24,
        y: y + 0.56,
        w: w - 0.46,
        h: h - 0.7,
        fontFace: "Aptos",
        fontSize: 13,
        color: C.text,
        paraSpaceAfterPt: 10,
      }
    );
  }
}

function pill(s, x, y, w, text, fill, txt = "FFFFFF") {
  s.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.42,
    radius: 0.12,
    fill: { color: fill },
    line: { color: fill },
  });
  s.addText(text, {
    x: x + 0.06,
    y: y + 0.1,
    w: w - 0.12,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 12,
    bold: true,
    color: txt,
    align: "center",
  });
}

// 1. Cover
{
  const s = pptx.addSlide();
  topBand(s, 1);

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 1.0,
    w: 12,
    h: 5.9,
    radius: 0.14,
    fill: { color: C.white },
    line: { color: C.line, pt: 1 },
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 8.7,
    y: 1.0,
    w: 4.0,
    h: 5.9,
    radius: 0.14,
    fill: { color: "E0F2FE" },
    line: { color: "BAE6FD" },
  });

  s.addShape(pptx.ShapeType.chevron, {
    x: 9.15,
    y: 2.15,
    w: 2.9,
    h: 1.0,
    fill: { color: C.accentA },
    line: { color: C.accentA },
  });
  s.addShape(pptx.ShapeType.chevron, {
    x: 9.15,
    y: 3.2,
    w: 2.9,
    h: 1.0,
    fill: { color: C.accentB },
    line: { color: C.accentB },
  });
  s.addShape(pptx.ShapeType.chevron, {
    x: 9.15,
    y: 4.25,
    w: 2.9,
    h: 1.0,
    fill: { color: C.accentC },
    line: { color: C.accentC },
  });

  s.addText("READYCOOL", {
    x: 1.25,
    y: 2.15,
    w: 7.2,
    h: 0.85,
    fontFace: "Aptos Display",
    fontSize: 56,
    bold: true,
    color: C.dark,
    charSpace: 1.2,
  });
  s.addText("Commercial Service Platform for Refrigeration Repairs", {
    x: 1.25,
    y: 3.06,
    w: 7.1,
    h: 0.7,
    fontFace: "Aptos",
    fontSize: 25,
    bold: true,
    color: C.accentA,
  });
  s.addText("Class Presentation | April 2026", {
    x: 1.25,
    y: 3.95,
    w: 4.5,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 13,
    color: C.muted,
  });

  pill(s, 1.25, 4.5, 2.15, "B2B Focus", C.dark);
  pill(s, 3.55, 4.5, 2.65, "Privacy by Design", C.accentA);
  pill(s, 6.35, 4.5, 1.9, "Scalable", C.accentB);
  pill(s, 1.25, 5.0, 2.0, "Live on Vercel", C.accentA);
  pill(s, 3.4, 5.0, 2.0, "API on Render", C.accentB);
  pill(s, 5.55, 5.0, 2.4, "SQL on Aiven", C.accentC, C.dark);
}

// 2. Introduction
{
  const s = pptx.addSlide();
  topBand(s, 2);
  titleBlock(s, "SECTION 01", "Introduction", "Built for a refrigeration service business and its field repair workflow");

  panel(s, 0.7, 2.15, 5.8, 4.6, "What is ReadyCool?", [
    "A digital platform for a commercial refrigeration service company",
    "Used by the admin to receive complaints and service requests from customers and agencies",
    "Helps coordinate 4-5 field workers without relying on Excel sheets, calls, and WhatsApp chats",
  ]);

  panel(s, 6.83, 2.15, 5.5, 4.6, "Who benefits?", [
    "Commercial clients with refrigeration repair needs",
    "The admin team handling complaints and job allocation",
    "Field workers who need clearer site-wise task visibility",
  ]);
}

// 3. Problem
{
  const s = pptx.addSlide();
  topBand(s, 3);
  titleBlock(s, "SECTION 02", "Problem We Are Solving", "Service work was spread across sheets, calls, and chat threads");

  panel(s, 0.7, 2.2, 12.0, 4.5, "Pain Points", [
    "Admin had to track complaints, service requests, and worker assignments manually",
    "Excel sheets and WhatsApp chats made follow-up hard to control and audit",
    "Phone calls slowed down coordination and created missed updates",
    "Commercial refrigeration repair needs structured job handling more than casual messaging",
    "The business needed a single operational system for day-to-day service work",
  ]);

  pill(s, 0.9, 6.85, 2.2, "Slow Cycles", C.accentD);
  pill(s, 3.25, 6.85, 3.05, "Excel + WhatsApp Load", C.accentC, C.dark);
  pill(s, 6.55, 6.85, 2.6, "Scattered Workflow", C.accentA);
}

// 4. Solution
{
  const s = pptx.addSlide();
  topBand(s, 4);
  titleBlock(s, "SECTION 03", "Our Solution", "One system for service operations, with resale as an added growth layer");

  panel(s, 0.7, 2.2, 3.85, 4.5, "BUY", [
    "Browse second-hand products when needed",
    "Filter by city, category, and pricing",
    "Scale the platform beyond service jobs",
  ], "EEF8FF");

  panel(s, 4.78, 2.2, 3.85, 4.5, "SELL", [
    "List used commercial equipment",
    "Upload image for stronger visibility",
    "Create an extra monetization stream",
  ], "EFFCF4");

  panel(s, 8.86, 2.2, 3.85, 4.5, "COMMERCIAL DESK", [
    "Central page for complaints and service requests",
    "Built to assign jobs to field workers",
    "Ready for multi-service generalization",
  ], "FFF7ED");
}

// 5. Implementation
{
  const s = pptx.addSlide();
  topBand(s, 5);
  titleBlock(s, "SECTION 04", "Implementation", "Admin receives requests, assigns work, and tracks progress in one flow");

  panel(s, 0.7, 2.25, 12.0, 4.45, "Architecture", []);

  // Lanes
  panel(s, 1.0, 2.75, 3.35, 3.55, "Frontend", [
    "React + Vite SPA",
    "Pages: Home, Buy, Sell, Dashboard",
    "Complaint and request visibility",
  ], "EAF2FF");

  panel(s, 5.0, 2.75, 3.35, 3.55, "Backend", [
    "Express REST APIs",
    "Auth + request handling endpoints",
    "File uploads using multer",
  ], "E9FFF6");

  panel(s, 9.0, 2.75, 3.35, 3.55, "Database", [
    "MySQL with mysql2",
    "Schema bootstrap via SQL",
    "Structured records for jobs and scale",
  ], "FFF7E8");

  s.addShape(pptx.ShapeType.chevron, {
    x: 4.43,
    y: 4.12,
    w: 0.4,
    h: 0.65,
    fill: { color: C.accentA },
    line: { color: C.accentA },
  });
  s.addShape(pptx.ShapeType.chevron, {
    x: 8.43,
    y: 4.12,
    w: 0.4,
    h: 0.65,
    fill: { color: C.accentA },
    line: { color: C.accentA },
  });

  s.addText("Live deployment: Frontend on Vercel | Backend on Render | Managed SQL on Aiven", {
    x: 1.0,
    y: 6.35,
    w: 11.2,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 12,
    bold: true,
    color: C.dark,
    align: "center",
  });
}

// 6. Tech Stack
{
  const s = pptx.addSlide();
  topBand(s, 6);
  titleBlock(s, "SECTION 05", "Tech Stack", "Built to run the service workflow smoothly and scale later");

  panel(s, 0.7, 2.2, 3.85, 4.5, "Frontend", [
    "React 18",
    "Vite",
    "React Router",
    "MUI + Emotion",
    "Axios",
  ]);

  panel(s, 4.78, 2.2, 3.85, 4.5, "Backend", [
    "Node.js + Express",
    "bcryptjs",
    "multer",
    "dotenv",
    "cors",
  ]);

  panel(s, 8.86, 2.2, 3.85, 4.5, "Database + Tooling", [
    "MySQL",
    "SQL schema script",
    "Nodemon",
    "Environment-based config",
    "Managed cloud DB on Aiven",
  ]);

  pill(s, 0.8, 6.85, 2.2, "Vercel: Frontend", C.accentA);
  pill(s, 3.2, 6.85, 2.2, "Render: Backend", C.accentB);
  pill(s, 5.6, 6.85, 2.0, "Aiven: SQL", C.accentC, C.dark);
}

// 7. Benefits & Impact
{
  const s = pptx.addSlide();
  topBand(s, 7);
  titleBlock(s, "SECTION 06", "Benefits and Impact", "Why this replaces manual coordination and still leaves room to grow");

  panel(s, 0.7, 2.2, 3.85, 4.5, "For Buyers", [
    "Quicker service response",
    "Clearer request status",
    "Less back-and-forth on calls",
  ], "EAF4FF");

  panel(s, 4.78, 2.2, 3.85, 4.5, "For Sellers", [
    "Extra resale channel for used equipment",
    "Simple listing process",
    "Better lead quality over noise",
  ], "ECFDF3");

  panel(s, 8.86, 2.2, 3.85, 4.5, "For Ecosystem", [
    "Supports equipment reuse",
    "Can shorten business cycles",
    "Digital foundation for future services",
  ], "FFF7E8");
}

// 8. USP
{
  const s = pptx.addSlide();
  topBand(s, 8);
  titleBlock(s, "SECTION 07", "Our USP", "A service-first model that can generalize to other providers");

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 2.15,
    w: 12.0,
    h: 4.55,
    radius: 0.12,
    fill: { color: "EAF2FF" },
    line: { color: "BFDBFE", pt: 1 },
  });

  s.addText("Privacy-first resale + routed commercial support", {
    x: 1.0,
    y: 2.65,
    w: 11.4,
    h: 0.9,
    fontFace: "Aptos Display",
    fontSize: 38,
    bold: true,
    color: C.dark,
    align: "center",
  });

  s.addText(
    "ReadyCool started as a service workflow for commercial refrigeration repairs, then expanded into buy and sell so the same platform can scale to other service-giving businesses like electrical maintenance, food service, and similar operations.",
    {
      x: 1.5,
      y: 3.75,
      w: 10.4,
      h: 1.2,
      fontFace: "Aptos",
      fontSize: 17,
      color: C.text,
      align: "center",
      valign: "mid",
    }
  );

  pill(s, 1.7, 5.45, 2.55, "Privacy Layer", C.accentA);
  pill(s, 4.85, 5.45, 2.75, "Unified Workflow", C.accentB);
  pill(s, 8.15, 5.45, 3.0, "Generalizable Model", C.accentC, C.dark);
}

// 9. Roadmap
{
  const s = pptx.addSlide();
  topBand(s, 9);
  titleBlock(s, "SECTION 08", "Roadmap", "How the same model can expand into other service businesses");

  panel(s, 0.7, 2.2, 12.0, 4.5, "Execution Priorities", []);

  s.addShape(pptx.ShapeType.line, {
    x: 1.25,
    y: 4.35,
    w: 10.9,
    h: 0,
    line: { color: "94A3B8", pt: 1.5 },
  });

  const items = [
    { x: 1.3, t: "Service/Tender APIs", c: C.accentA },
    { x: 4.0, t: "Inquiry Messaging", c: C.accentB },
    { x: 6.7, t: "Verification Pipeline", c: C.accentC },
    { x: 9.4, t: "KPI Dashboard", c: C.accentD },
  ];

  for (const it of items) {
    s.addShape(pptx.ShapeType.ellipse, {
      x: it.x,
      y: 4.1,
      w: 0.48,
      h: 0.48,
      fill: { color: it.c },
      line: { color: it.c },
    });
    s.addText(it.t, {
      x: it.x - 0.75,
      y: 4.78,
      w: 2.0,
      h: 0.5,
      fontFace: "Aptos",
      fontSize: 12,
      bold: true,
      color: C.dark,
      align: "center",
    });
  }

  s.addText("Near-term objective: move from a refrigeration service workflow into a reusable platform for other service providers.", {
    x: 1.2,
    y: 2.85,
    w: 10.9,
    h: 0.5,
    fontFace: "Aptos",
    fontSize: 16,
    color: C.text,
    align: "center",
  });
}

// 10. Closing
{
  const s = pptx.addSlide();
  topBand(s, 10);

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 1.0,
    w: 12.0,
    h: 5.95,
    radius: 0.14,
    fill: { color: C.white },
    line: { color: C.line, pt: 1 },
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 1.0,
    w: 12.0,
    h: 1.55,
    radius: 0.14,
    fill: { color: C.dark },
    line: { color: C.dark },
  });

  s.addText("Thank You", {
    x: 1.0,
    y: 1.38,
    w: 5,
    h: 0.6,
    fontFace: "Aptos Display",
    fontSize: 40,
    bold: true,
    color: C.white,
  });

  s.addText("Questions?", {
    x: 1.0,
    y: 2.95,
    w: 4.5,
    h: 0.7,
    fontFace: "Aptos Display",
    fontSize: 48,
    bold: true,
    color: C.dark,
  });

  s.addText("ReadyCool digitizes fragmented refrigeration procurement with a privacy-first, scalable B2B workflow.", {
    x: 1.0,
    y: 4.0,
    w: 8.1,
    h: 1.1,
    fontFace: "Aptos",
    fontSize: 17,
    color: C.text,
    valign: "mid",
  });

  pill(s, 1.0, 5.55, 2.5, "readycool | SIRS_Z", C.accentA);
  pill(s, 3.7, 5.55, 2.0, "Live Stack", C.dark);
  pill(s, 5.9, 5.55, 2.0, "Vercel", C.accentA);
  pill(s, 8.1, 5.55, 1.8, "Render", C.accentB);
  pill(s, 10.05, 5.55, 1.4, "Aiven", C.accentC, C.dark);
}

pptx.writeFile({ fileName: "ReadyCool-Class-Presentation-v4.pptx" });
