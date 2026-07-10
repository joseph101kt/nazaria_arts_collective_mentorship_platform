import { redirect } from "next/navigation";

export default function onboarding_base(): never {
  redirect("/auth/onboarding/role");
}