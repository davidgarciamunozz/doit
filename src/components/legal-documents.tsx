"use client";
import React from "react";
import { FileText, RefreshCw, Shield } from "lucide-react";
import Link from "next/link";

type LegalDocumentsParams = {
  minimalist: boolean;
};

export default function LegalDocuments({ minimalist }: LegalDocumentsParams) {
  if (minimalist) {
    return (
      <>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Legal Documents</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/legal/privacy`}
            className="flex items-center justify-center px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </span>
          </Link>
          <Link
            href={`/legal/terms`}
            className="flex items-center justify-center px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </span>
          </Link>
          <Link
            href={`/legal/refund`}
            className="flex items-center justify-center px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <span className="text-sm text-muted-foreground hover:text-primary">
              Refund Policy
            </span>
          </Link>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <span className="text-base font-medium text-foreground">
          Legal Documents
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href={`/legal/privacy`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all group"
        >
          <Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          <span className="text-sm text-card-foreground group-hover:text-primary">
            Privacy Policy
          </span>
        </Link>
        <Link
          href={`/legal/terms`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all group"
        >
          <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          <span className="text-sm text-card-foreground group-hover:text-primary">
            Terms of Service
          </span>
        </Link>
        <Link
          href={`/legal/refund`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all group"
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          <span className="text-sm text-card-foreground group-hover:text-primary">
            Refund Policy
          </span>
        </Link>
      </div>
    </>
  );
}
