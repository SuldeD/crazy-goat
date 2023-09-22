// import { revalidateTag } from "next/cache";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

export async function gameFetch({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
}) {
  try {
    const endpoint = `${GAME_DOMAIN}${query}`;

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        // Authorization: `JWT ${cookies().get("jwt")}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    throw {
      error: e,
      query,
    };
  }
}
