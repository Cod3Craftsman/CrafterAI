import pptxgen from "pptxgenjs";

/**
 * Premium presentation generator
 * data = {
 *   title: string,
 *   subtitle: string,
 *   slides: [{ title: string, points: string[] }]
 * }
 */
const generatePpt = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pptx = new pptxgen();

      // ---------- Presentation settings ----------
      pptx.layout = "LAYOUT_WIDE"; // 13.333" x 7.5"
      pptx.author = "Ankit Gupta";
      pptx.subject = data?.title || "Presentation";
      pptx.title = data?.title || "Presentation";
      pptx.company = "CrafterAI by Ankit";
      pptx.lang = "en-US";

      const W = 13.333;
      const H = 7.5;

      // ---------- Palette: "Midnight Indigo" (dark, premium) ----------
      // One dominant tone (dark navy), one supporting tone (card navy),
      // one sharp accent (indigo). Kept dark throughout for a premium feel.
      const BG = "0B1020";
      const CARD = "151B2E";
      const CARD_BORDER = "26304A";
      const ACCENT = "6366F1";
      const ACCENT_SOFT = "3730A3";
      const WHITE = "F8FAFC";
      const MUTED = "97A3B8";

      // Safe fonts: render true-to-width in QA and ship with Office.
      const FONT_HEAD = "Cambria"; // serif header = personality, zero QA risk
      const FONT_BODY = "Calibri";

      // ---------- Small helpers ----------
      const footer = (slide, pageNum) => {
        slide.addText("CrafterAI", {
          x: 0.6,
          y: 7.05,
          w: 2,
          h: 0.25,
          fontFace: FONT_BODY,
          fontSize: 9,
          bold: true,
          color: MUTED,
          charSpacing: 1,
          margin: 0,
          isTextBox: true,
        });
        slide.addText(String(pageNum).padStart(2, "0"), {
          x: W - 1.2,
          y: 7.05,
          w: 0.8,
          h: 0.25,
          fontFace: FONT_BODY,
          fontSize: 9,
          bold: true,
          color: MUTED,
          align: "right",
          margin: 0,
          isTextBox: true,
        });
      };

      // Icon-in-circle motif, reused across every slide for visual consistency
      const iconCircle = (slide, x, y, size, glyph, opts = {}) => {
        slide.addShape(pptx.ShapeType.ellipse, {
          x,
          y,
          w: size,
          h: size,
          fill: { color: opts.fill || ACCENT },
          line: { type: "none" },
        });
        slide.addText(glyph, {
          x,
          y: y - 0.01,
          w: size,
          h: size,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize || 13,
          bold: true,
          color: WHITE,
          align: "center",
          valign: "middle",
          margin: 0,
          isTextBox: true,
        });
      };

      // =====================================================
      // TITLE SLIDE
      // =====================================================
      let slide = pptx.addSlide();
      slide.background = { color: BG };

      // Soft oversized circle in the corner — the visual motif, not a stripe
      slide.addShape(pptx.ShapeType.ellipse, {
        x: W - 4.2,
        y: -2.2,
        w: 6.5,
        h: 6.5,
        fill: { color: ACCENT_SOFT, transparency: 55 },
        line: { type: "none" },
      });
      slide.addShape(pptx.ShapeType.ellipse, {
        x: W - 2.3,
        y: -0.6,
        w: 3.2,
        h: 3.2,
        fill: { color: ACCENT, transparency: 70 },
        line: { type: "none" },
      });

      slide.addText("PRESENTATION", {
        x: 0.8,
        y: 2.55,
        w: 7,
        h: 0.3,
        fontFace: FONT_BODY,
        fontSize: 11,
        bold: true,
        color: ACCENT,
        charSpacing: 2,
        margin: 0,
        isTextBox: true,
      });

      slide.addText(data?.title || "Presentation", {
        x: 0.8,
        y: 2.9,
        w: 10.8,
        h: 1.7,
        fontFace: FONT_HEAD,
        fontSize: 40,
        bold: true,
        color: WHITE,
        margin: 0,
        isTextBox: true,
        fit: "shrink",
      });

      if (data?.subtitle) {
        slide.addText(data.subtitle, {
          x: 0.82,
          y: 4.55,
          w: 8.5,
          h: 0.8,
          fontFace: FONT_BODY,
          fontSize: 16,
          color: MUTED,
          margin: 0,
          isTextBox: true,
          fit: "shrink",
        });
      }

      footer(slide, 1);

      // =====================================================
      // CONTENT SLIDES — layouts alternate so the deck doesn't repeat itself
      // =====================================================
      const sections = data?.slides || [];

      sections.forEach((section, index) => {
        slide = pptx.addSlide();
        slide.background = { color: BG };

        const pageNum = index + 2;
        const points = (section?.points || []).slice(0, 6);
        const useSplitLayout = points.length <= 3; // fewer points -> more dramatic, spacious layout

        // Small section label (top-left, no bar/stripe under it)
        slide.addText(`SECTION ${String(index + 1).padStart(2, "0")}`, {
          x: 0.7,
          y: 0.55,
          w: 4,
          h: 0.28,
          fontFace: FONT_BODY,
          fontSize: 10,
          bold: true,
          color: ACCENT,
          charSpacing: 1.5,
          margin: 0,
          isTextBox: true,
        });

        slide.addText(section?.title || "Untitled Section", {
          x: 0.7,
          y: 0.9,
          w: 11.4,
          h: 0.75,
          fontFace: FONT_HEAD,
          fontSize: 30,
          bold: true,
          color: WHITE,
          margin: 0,
          isTextBox: true,
          fit: "shrink",
        });

        if (useSplitLayout) {
          // ---------- Layout B: spacious two-column, big first point ----------
          const [lead, ...rest] = points;

          // Left: large emphasized lead point inside a card
          slide.addShape(pptx.ShapeType.roundRect, {
            x: 0.7,
            y: 2.1,
            w: 5.7,
            h: 4.5,
            rectRadius: 0.12,
            fill: { color: CARD },
            line: { color: CARD_BORDER, width: 1 },
          });
          iconCircle(slide, 1.1, 2.5, 0.55, "★", { fontSize: 20 });
          slide.addText(lead || "", {
            x: 1.1,
            y: 3.35,
            w: 4.9,
            h: 2.9,
            fontFace: FONT_HEAD,
            fontSize: 22,
            bold: true,
            color: WHITE,
            margin: 0,
            isTextBox: true,
            valign: "top",
            fit: "shrink",
          });

          // Right: supporting points, stacked cards
          const rightX = 6.7;
          const rightW = 5.95;
          const rowH = rest.length ? Math.min(1.35, 4.5 / rest.length) : 1.35;
          rest.forEach((point, i) => {
            const y = 2.1 + i * (rowH + 0.15);
            slide.addShape(pptx.ShapeType.roundRect, {
              x: rightX,
              y,
              w: rightW,
              h: rowH,
              rectRadius: 0.1,
              fill: { color: CARD },
              line: { color: CARD_BORDER, width: 1 },
            });
            iconCircle(slide, rightX + 0.3, y + rowH / 2 - 0.22, 0.44, String(i + 1), {
              fontSize: 14,
            });
            slide.addText(point, {
              x: rightX + 0.95,
              y,
              w: rightW - 1.2,
              h: rowH,
              fontFace: FONT_BODY,
              fontSize: 15,
              color: WHITE,
              margin: 0,
              isTextBox: true,
              valign: "middle",
              fit: "shrink",
            });
          });
        } else {
          // ---------- Layout A: icon rows inside one content card ----------
          slide.addShape(pptx.ShapeType.roundRect, {
            x: 0.7,
            y: 2.05,
            w: 11.9,
            h: 4.55,
            rectRadius: 0.1,
            fill: { color: CARD },
            line: { color: CARD_BORDER, width: 1 },
          });

          const rowH = 4.55 / points.length;
          points.forEach((point, i) => {
            const y = 2.05 + i * rowH + rowH / 2 - 0.19;
            iconCircle(slide, 1.05, y, 0.38, "✓", { fontSize: 13 });
            slide.addText(point, {
              x: 1.65,
              y: 2.05 + i * rowH,
              w: 10.4,
              h: rowH,
              fontFace: FONT_BODY,
              fontSize: 16,
              color: WHITE,
              margin: 0,
              isTextBox: true,
              valign: "middle",
              fit: "shrink",
            });
            // hairline divider between rows (not a full stripe/bar)
            if (i > 0) {
              slide.addShape(pptx.ShapeType.line, {
                x: 1.05,
                y: 2.05 + i * rowH,
                w: 11.2,
                h: 0,
                line: { color: CARD_BORDER, width: 0.75 },
              });
            }
          });
        }

        footer(slide, pageNum);
      });

      // =====================================================
      // CLOSING SLIDE
      // =====================================================
      slide = pptx.addSlide();
      slide.background = { color: BG };

      slide.addShape(pptx.ShapeType.ellipse, {
        x: -2.5,
        y: H - 4,
        w: 6.5,
        h: 6.5,
        fill: { color: ACCENT_SOFT, transparency: 55 },
        line: { type: "none" },
      });

      slide.addText("THANK YOU", {
        x: 0.8,
        y: 2.9,
        w: 8,
        h: 0.3,
        fontFace: FONT_BODY,
        fontSize: 11,
        bold: true,
        color: ACCENT,
        charSpacing: 2,
        margin: 0,
        isTextBox: true,
      });
      slide.addText("Questions & Discussion", {
        x: 0.8,
        y: 3.25,
        w: 10.5,
        h: 1.3,
        fontFace: FONT_HEAD,
        fontSize: 34,
        bold: true,
        color: WHITE,
        margin: 0,
        isTextBox: true,
        fit: "shrink",
      });

      footer(slide, sections.length + 2);

      // ---------- Generate buffer ----------
      const buffer = await pptx.write({ outputType: "nodebuffer" });
      resolve(buffer);
    } catch (error) {
      reject(error);
    }
  });
};

export default generatePpt;