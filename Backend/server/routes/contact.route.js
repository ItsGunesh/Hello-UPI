import { Router } from "express";
import {fetchContacts} from "../controllers/contacts.controller.js"

const router = Router()

router.route('/fetchcontacts').get(fetchContacts)

export default router