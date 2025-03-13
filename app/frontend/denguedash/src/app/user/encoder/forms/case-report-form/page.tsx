import MultiStepForm from "@components/case-report-form/MultiStepForm";
import { cookies } from "next/headers";
import { getDataFromToken } from "@/lib/token";
import { TokenData } from "@/interfaces/auth/token-data-interface";

export default async function CaseReportForm() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  // todo: refactor this
  if (!accessToken) {
    console.error("Access token is undefined");
    return null;
  }
  const dataFromToken: TokenData | null = await getDataFromToken(
    accessToken.value
  );
  if (!dataFromToken) {
    console.error("Data from token is null");
    return null;
  }
  const userId = dataFromToken.user_id;
  if (userId === null) {
    console.error("User ID is null");
    return null;
  }
  return <MultiStepForm userId={userId} />;
}
