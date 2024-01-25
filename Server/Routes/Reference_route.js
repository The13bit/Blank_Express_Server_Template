/**
 * -----------------------------------------------------------------------------
 * WARNING: This code base is obsolete and is only for reference purposes.
 * Please do not use this for any active development.
 * -----------------------------------------------------------------------------
 */

import express from 'express';
import { Allres, Resultprocess, UpdateOptions, authcheck, deletcollection, getallresults, uploaddataset } from '../Controller/Ref_Controller.js';
import singleupload from '../middleware/Multer.js';
import { auth, authorizeadmin } from '../middleware/Auth.js';

const router = express.Router();

router.route("/upload").post(singleupload,uploaddataset).get(deletcollection);
router.route("/Results").post(getallresults);
router.route("/Getall").get(Allres);

router.route("/ResultProcess").post(Resultprocess)

router.route("/UpdateOptions").get(UpdateOptions)

router.route("/auth_check").get(authcheck)

export default router;