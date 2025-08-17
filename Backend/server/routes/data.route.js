import { Router } from "express";
import { getBalance ,getTransactions,fetchName} from "../controllers/data.controller.js";

const router = Router()

router.route('/getbalance').get(getBalance)
router.route('/gettransactions').get(getTransactions)
router.route('/fetchname/:id').get(fetchName)

export default router