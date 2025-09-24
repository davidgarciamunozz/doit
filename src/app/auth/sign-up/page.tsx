import { SignUpForm } from "@/components/sign-up-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
