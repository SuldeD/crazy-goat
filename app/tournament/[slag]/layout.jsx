import React, { Suspense } from "react";
import Loader from "../../../components/Loader";

export default async function Layout({ children }) {
  return (
    <div className="w-full">
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </div>
  );
}
