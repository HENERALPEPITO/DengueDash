"use client";

import { Button } from "@/shadcn/components/ui/button";
import postService from "@/services/post.service";

export default function Dashboard() {
  const predictCases = async () => {
    const predictions = await postService.predictCases();
    console.log(predictions);
  };
  return (
    <Button variant={"outline"} onClick={predictCases}>
      Predict Cases
    </Button>
  );
}
