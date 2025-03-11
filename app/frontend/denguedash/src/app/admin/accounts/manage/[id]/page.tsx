"use client";

import { useEffect } from "react";

export default function UserDetailView({ params }: any) {
  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      console.log(id);
    };
    fetchData();
  }, [params]);
  return <p>Helo</p>;
}
