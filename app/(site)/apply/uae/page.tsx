import type { Metadata } from "next";
import ApplyPage from "../ApplyPage";

export const metadata: Metadata = {
  title: "Apply for UAE Jobs | SOS Work Abroad",
};

export default function Page() {
  return <ApplyPage destination="uae" />;
}