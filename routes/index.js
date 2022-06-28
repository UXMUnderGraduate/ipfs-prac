import { Router } from "express";
import multer from "multer";
import * as IPFS from "ipfs-core";

const upload = multer({ storage: multer.memoryStorage() });
const node = await IPFS.create();

const router = Router();

router.post("/add", upload.single("file"), async (req, res, next) => {
  const { originalname, buffer } = req.file;
  const data = {
    path: originalname,
    content: buffer,
  };

  const { cid } = await node.add(data);

  console.log(cid.toString());

  return res.send(cid.toString());
});

router.get("/cat", async (req, res, next) => {
  const { cid } = req.body;
  let chunks = [];

  for await (const chunk of node.cat(cid)) {
    chunks.push(chunk);
  }

  const data = Buffer.concat(chunks);

  return res.send(data);
});

export default router;
