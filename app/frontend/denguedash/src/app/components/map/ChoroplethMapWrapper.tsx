"use client";

import dynamic from "next/dynamic";

const ChoroplethMapWrapper = dynamic(() => import("./ChoroplethMap"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default ChoroplethMapWrapper;
