import { Router } from "express";
import multer from "multer"
import { extract , recognise} from "../controllers/nlp.controller.js";

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.route("/extract").post(extract)
router.post("/recognise", upload.single("file"), recognise)

export default router