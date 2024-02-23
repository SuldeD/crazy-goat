import React, { Suspense } from "react";
import Loader from "../../../../components/Loader";

export default function LayoutName({ children }) {
  return (
    <div>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </div>
  );
}
