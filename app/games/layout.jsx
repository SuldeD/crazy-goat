import React, { Suspense } from "react";
import Loader from "../../components/Loader";

export default async function Layout({ children }) {
  return (
    <div className="w-full gap-10">
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </div>
  );
}
