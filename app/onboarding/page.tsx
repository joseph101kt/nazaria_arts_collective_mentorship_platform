import { redirect } from "next/navigation";

export default function onboarding_redirect(): never {
  redirect("/auth/onboarding");
}