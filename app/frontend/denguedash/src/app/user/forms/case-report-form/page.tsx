import MultiStepForm from "@components/case-report-form/MultiStepForm";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "@/lib/token";

export default async function CaseReportForm() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  // todo: refactor this
  if (accessToken) {
    const userId = await getUserIdFromToken(accessToken.value);
    if (userId !== null) {
      return <MultiStepForm userId={userId} />;
    } else {
      console.error("User ID is null");
      return null;
    }
  } else {
    console.error("Access token is undefined");
    return null;
  }
}
