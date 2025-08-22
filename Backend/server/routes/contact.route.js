import { Router } from "express";
import {fetchContacts,createContact} from "../controllers/contacts.controller.js"

const router = Router()

router.route('/fetchcontacts').get(fetchContacts)
router.route('/createcontact').post(createContact)

export default router