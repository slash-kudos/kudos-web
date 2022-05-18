import { Kudo } from "@slashkudos/kudos-api";
import type { NextApiRequest, NextApiResponse } from "next";
import { ListKudosResponse } from "../../../models/ListKudosResponse";
import { KudosApiService } from "../../../services/kudosApiService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListKudosResponse>
) {
  const nextToken = req.query.nextToken as string | undefined;
  const pageSize = req.query.pageSize
    ? Number.parseInt(req.query.pageSize as string)
    : Number.parseInt(process.env.DEFAULT_FEED_PAGE_SIZE || "25");

  const client = await KudosApiService.getClient();
  const kudosConnection = await client.listKudosByDate({
    type: "Kudo",
    limit: pageSize,
    nextToken: nextToken,
  });
  const kudosResult = kudosConnection.items.filter(
    (kudo) => kudo != null
  ) as Kudo[];
  return res
    .status(200)
    .json({ result: kudosResult, response: kudosConnection });
}
