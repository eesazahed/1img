import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const id = req.query.id as string;

  if (!id.match(/^\d+$/)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const image = await prisma.image.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imageData = Buffer.from(image.img.split(",")[1], "base64");
    return res
      .status(200)
      .setHeader("Content-Type", "image/png")
      .end(imageData);
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
