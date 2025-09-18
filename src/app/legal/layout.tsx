"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const legalDocuments = [
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: ShieldAlert,
    description: "How we handle and protect your data",
  },
  {
    id: "terms",
    title: "Terms of Service",
    icon: FileText,
    description: "Rules and guidelines for using our service",
  },
  {
    id: "refund",
    title: "Refund Policy",
    icon: RefreshCw,
    description: "Our policy on refunds and cancellations",
  },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm cursor-pointer"
            variant={"outline"}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Legal Documents</h2>
                <p className="text-sm text-foreground/80 mt-1">
                  Important information about our services
                </p>
              </div>
              <nav className="p-4 space-y-2">
                {legalDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/legal/${doc.id}`}
                    className="block p-3 rounded-md hover:bg-foreground/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <doc.icon className="w-5 h-5" />
                      <div>
                        <div className="text-sm font-bold">{doc.title}</div>
                        <div className="text-xs text-foreground">
                          {doc.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
