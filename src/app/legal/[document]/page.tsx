"use client";

import { use } from "react";
import LegalDocument from "@/components/legal-document";
import { notFound } from "next/navigation";

const legalDocuments = {
  privacy: {
    title: "Privacy Notice",
    path: "/terms/privacy-notice.md",
  },
  terms: {
    title: "Terms of Service",
    path: "/terms/terms-of-service.md",
  },
  refund: {
    title: "Refund Policy",
    path: "/terms/refund-policy.md",
  },
} as const;

type LegalDocument = keyof typeof legalDocuments;

interface LegalPageProps {
  document: LegalDocument;
  lng: string;
}

interface LegalPageParams {
  params: Promise<LegalPageProps>;
}

export default function LegalPage({ params }: LegalPageParams) {
  const { document } = use<LegalPageProps>(params);

  if (!legalDocuments[document]) {
    notFound();
  }

  const { title, path } = legalDocuments[document];

  return <LegalDocument title={title} filePath={path} />;
}
