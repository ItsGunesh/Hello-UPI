import { Router } from "express";
import { getBalance } from "../controllers/data.controller.js";

const router = Router()

router.route('/getbalance').get(getBalance)


export default router