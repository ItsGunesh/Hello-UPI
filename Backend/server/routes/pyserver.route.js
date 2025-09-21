import { Router } from "express";
import { extract } from "../controllers/nlp.controller.js";

const router = Router()

router.route("/extract").post(extract)

export default router