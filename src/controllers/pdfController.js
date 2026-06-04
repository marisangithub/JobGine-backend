const PDFDocument = require("pdfkit");

exports.downloadResume = async (
  req,
  res
) => {
  try {

    const {
      content,
      fileName
    } = req.body;

    const doc =
      new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName || "resume"}.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(12);

    doc.text(content, {
      align: "left"
    });

    doc.end();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "PDF generation failed"
    });
  }
};