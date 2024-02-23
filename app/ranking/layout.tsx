// import MTable from "../../components/Table";
// import MText from "../../components/Text";

import React, { Suspense } from "react";
import { Stack } from "@chakra-ui/react";
import Loader from "../../components/Loader";
import MText from "../../components/Text";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full gap-10">
      <Stack align="center" my="10">
        <MText title={true} text={"Ranking"} sub={undefined} />
      </Stack>

      <Suspense fallback={<Loader />}>{children}</Suspense>
    </div>
  );
}
