export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export type DocumentType = "passport" | "cv" | "certificate";

const IMAGE_OR_PDF = ["image/jpeg", "image/png", "application/pdf"];

export const documentTypes: {
  type: DocumentType;
  label: string;
  description: string;
  tips: string;
  mimes: string[];
}[] = [
  {
    type: "passport",
    label: "Passport",
    description: "The page with your photo and personal details.",
    tips: "A clear photo or scan. All four corners must be visible.",
    mimes: IMAGE_OR_PDF,
  },
  {
    type: "cv",
    label: "CV with your photo",
    description: "Your CV with a passport-size photo of you on it.",
    tips: "PDF or Word document, or a clear photo of the CV.",
    mimes: [
      ...IMAGE_OR_PDF,
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  {
    type: "certificate",
    label: "School certificate",
    description: "JHS certificate or higher.",
    tips: "A clear photo or scan of the whole certificate.",
    mimes: IMAGE_OR_PDF,
  },
];

export const extensionForMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

export function getDocumentType(type: string) {
  return documentTypes.find((d) => d.type === type);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}