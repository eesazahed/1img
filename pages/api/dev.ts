import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const env = process.env.NODE_ENV;

  res.status(200).json({ env });
};

export default handler;
