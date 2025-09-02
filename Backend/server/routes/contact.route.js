import { Router } from "express";
import {fetchContacts,createContact,fundAcc} from "../controllers/contacts.controller.js"

const router = Router()

router.route('/fetchcontacts').get(fetchContacts)
router.route('/createcontact').post(createContact)
router.route('/fundacc').post(fundAcc)

export default router