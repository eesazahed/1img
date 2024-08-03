import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const id = req.query.id as string;

  try {
    const image = await prisma.image.findUnique({
      where: {
        id: id,
      },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const data = image.imageData;

    if (data.split(",")[0] === "data:image/webp;base64") {
      const imageData = Buffer.from(data.split(",")[1], "base64");

      return res
        .status(200)
        .setHeader("Content-Type", "image/webp")
        .end(imageData);
    }

    return res.status(200).json({ message: "Invalid file format." });
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
