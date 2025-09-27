import { Router } from "express";
import {fetchContacts,createContact,fundAcc,exist} from "../controllers/contacts.controller.js"

const router = Router()

router.route('/fetchcontacts').get(fetchContacts)
router.route('/createcontact').post(createContact)
router.route('/fundacc').post(fundAcc)
router.route('/exist').post(exist)

export default router