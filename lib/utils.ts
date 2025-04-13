import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import { ThreadType } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: string;
  content: string;
  id?: string;
}

function renderMarkdownText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number
): number {
  let currentY = y;
  const lineHeight = 7;

  const lines = pdf.splitTextToSize(text, maxWidth);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    currentY = processMarkdownLine(
      pdf,
      line,
      x,
      currentY,
      maxWidth,
      lineHeight
    );
  }

  return currentY;
}

function processMarkdownLine(
  pdf: jsPDF,
  line: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const segments: {
    text: string;
    isBold: boolean;
    isItalic: boolean;
  }[] = [];

  const boldRegex = /\*\*(.*?)\*\*/g;
  let boldMatch;
  let lastBoldEnd = 0;

  while ((boldMatch = boldRegex.exec(line)) !== null) {
    if (boldMatch.index > lastBoldEnd) {
      segments.push({
        text: line.substring(lastBoldEnd, boldMatch.index),
        isBold: false,
        isItalic: false,
      });
    }

    segments.push({
      text: boldMatch[1],
      isBold: true,
      isItalic: false,
    });

    lastBoldEnd = boldMatch.index + boldMatch[0].length;
  }

  if (lastBoldEnd < line.length) {
    segments.push({
      text: line.substring(lastBoldEnd),
      isBold: false,
      isItalic: false,
    });
  }

  if (segments.length === 0) {
    segments.push({
      text: line,
      isBold: false,
      isItalic: false,
    });
  }

  const processedSegments: typeof segments = [];

  for (const segment of segments) {
    if (segment.isBold) {
      processedSegments.push(segment);
      continue;
    }

    const italicRegex = /\*(.*?)\*/g;
    let italicMatch;
    let lastItalicEnd = 0;
    const text = segment.text;
    let foundItalic = false;

    while ((italicMatch = italicRegex.exec(text)) !== null) {
      foundItalic = true;
      if (italicMatch.index > lastItalicEnd) {
        processedSegments.push({
          text: text.substring(lastItalicEnd, italicMatch.index),
          isBold: false,
          isItalic: false,
        });
      }

      processedSegments.push({
        text: italicMatch[1],
        isBold: false,
        isItalic: true,
      });

      lastItalicEnd = italicMatch.index + italicMatch[0].length;
    }

    if (foundItalic && lastItalicEnd < text.length) {
      processedSegments.push({
        text: text.substring(lastItalicEnd),
        isBold: false,
        isItalic: false,
      });
    }

    if (!foundItalic) {
      processedSegments.push(segment);
    }
  }

  let currentX = x;

  for (const segment of processedSegments) {
    const currentFontStyle = pdf.getFont().fontStyle;

    if (segment.isBold) {
      pdf.setFont("helvetica", "bold");
    } else if (segment.isItalic) {
      pdf.setFont("helvetica", "italic");
    } else {
      pdf.setFont("helvetica", "normal");
    }

    const segmentWidth =
      (pdf.getStringUnitWidth(segment.text) * pdf.getFontSize()) /
      pdf.internal.scaleFactor;

    if (currentX + segmentWidth > x + maxWidth) {
      currentX = x;
      y += lineHeight;
    }

    pdf.text(segment.text, currentX, y);

    currentX += segmentWidth;

    pdf.setFont("helvetica", currentFontStyle);
  }

  return y + lineHeight;
}

export async function exportThreadAsPDF(thread: ThreadType) {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const truncatedTitle = thread.title
      ? thread.title.length > 40
        ? thread.title.substring(0, 40) + "..."
        : thread.title
      : "Chat Conversation";

    pdf.setProperties({
      title: truncatedTitle,
      subject: "AI Chat Export",
      creator: "AI Chat App",
    });

    pdf.setFontSize(18);
    pdf.text(truncatedTitle, 20, 20);
    pdf.setFontSize(12);

    const exportDate = new Date().toLocaleString();
    pdf.text(`Exported on: ${exportDate}`, 20, 30);

    pdf.setLineWidth(0.5);
    pdf.line(20, 35, 190, 35);

    let yPos = 45;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = 210 - margin * 2;
    const pageHeight = 297;
    const maxYPos = pageHeight - margin;

    let messages: Message[] = [];
    try {
      if (thread.messages) {
        messages = JSON.parse(thread.messages) as Message[];
      }
    } catch (e) {
      console.error("Error parsing messages:", e);
    }

    if (messages.length === 0) {
      pdf.text("No messages in this conversation.", margin, yPos);
    } else {
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const isUserMessage = message.role === "user";

        if (isUserMessage && i > 0) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(10);
        if (isUserMessage) {
          pdf.setTextColor(0, 0, 255);
        } else {
          pdf.setTextColor(128, 0, 128);
        }

        pdf.text(isUserMessage ? "You:" : "AI:", margin, yPos);
        yPos += lineHeight - 2;

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);

        const messageLines = message.content.split("\n");
        let currentLine = 0;

        while (currentLine < messageLines.length) {
          const remainingSpace = maxYPos - yPos;

          if (!isUserMessage && remainingSpace < 30 && currentLine > 0) {
            pdf.addPage();
            yPos = 20;
          }

          let contentChunk = "";
          let linesProcessed = 0;
          let estimatedHeight = 0;

          while (
            currentLine + linesProcessed < messageLines.length &&
            estimatedHeight + lineHeight < remainingSpace
          ) {
            contentChunk += messageLines[currentLine + linesProcessed] + "\n";
            linesProcessed++;
            estimatedHeight += lineHeight;
          }

          if (linesProcessed === 0 && currentLine < messageLines.length) {
            contentChunk = messageLines[currentLine] + "\n";
            linesProcessed = 1;
          }

          const newYPos = renderMarkdownText(
            pdf,
            contentChunk.trim(),
            margin,
            yPos,
            pageWidth
          );

          yPos = newYPos;
          currentLine += linesProcessed;

          if (currentLine < messageLines.length && yPos > maxYPos - 20) {
            pdf.addPage();
            yPos = 20;
          }
        }

        yPos += 3;

        if (i < messages.length - 1) {
          if (yPos < maxYPos - 10) {
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, yPos - 2, 190, yPos - 2);
            yPos += 3;
          }
        }
      }
    }

    const truncatedFilename = thread.title
      ? thread.title.length > 30
        ? thread.title.substring(0, 30) + "..."
        : thread.title
      : "chat-export";

    const filename = `${truncatedFilename}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error("Error exporting PDF:", error);
    return { success: false, error };
  }
}
