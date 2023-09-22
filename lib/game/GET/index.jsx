// import { gameFetch } from "../index";
// import { cookies } from "next/headers";

// export async function getTournaments({ TAGS }) {
//   const res = gameFetch({
//     query: "api/tournoments-web3/?type=active",
//     tags: [TAGS],
//     jwt: cookies().get(),
//   });

//   console.log(res);

//   //   return (
//   //     res.body?.data?.menu?.items.map((item) => ({
//   //       title: item.title,
//   //       path: item.url
//   //         .replace(domain, "")
//   //         .replace("/collections", "/search")
//   //         .replace("/pages", ""),
//   //     })) || []
//   //   );
// }

export async function getTournaments() {
  const res = await fetch(
    "https://api-game.mongolnft.com/api/tournoments-web3/?type=active",
    {
      next: { tags: ["tournaments"] },
      cache: "no-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
