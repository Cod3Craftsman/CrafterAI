import PDFDocument from "pdfkit";

const generatePdf = async (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Author: "CrafterAI",
        Title: data?.title,
        Creator: "CrafterAI",
      },
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.on("error", () => reject);

    // Accent line
    doc
      .rect(50, 45, 495, 4)
      .fillColor("#6366F1")
      .fill();

    doc.moveDown(1);

    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .fillColor("#111827")
      .text(data?.title || "Document", {
        align: "center",
      });

    doc.moveDown(0.5);

    // Subtitle
    if (data?.subtitle) {
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#6B7280")
        .text(data.subtitle, {
          align: "center",
        });

      doc.moveDown(1);
    }

    // Divider
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .lineWidth(1)
      .strokeColor("#E5E7EB")
      .stroke();

    doc.moveDown(1);

    // Sections
    data?.sections?.forEach((section) => {
      // Section heading
      doc
        .font("Helvetica-Bold")
        .fontSize(17)
        .fillColor("#4F46E5")
        .text(section.heading);

      doc.moveDown(0.4);

      // Points
      section.points?.forEach((point) => {
        doc
          .font("Helvetica")
          .fontSize(11.5)
          .fillColor("#374151")
          .text(`• ${point}`, {
            lineGap: 4,
            paragraphGap: 3,
            indent: 8,
          });
      });

      // Section spacing
      doc.moveDown(0.8);

      // Section divider
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .lineWidth(0.5)
        .strokeColor("#E5E7EB")
        .stroke();

      doc.moveDown(0.8);
    });

    doc.moveDown(1);

    // Footer
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#6366F1")
      .text("CRAFTerAI", {
        align: "center",
      });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#9CA3AF")
      .text("AI-powered document generation", {
        align: "center",
      });

    doc.end();
  });
};

export default generatePdf;