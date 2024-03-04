import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { imageBase64 } = req.body;

    try {
      const createdImage = await prisma.image.create({
        data: {
          img: imageBase64,
        },
      });

      res.status(200).json({ id: createdImage.id });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Error uploading image" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
