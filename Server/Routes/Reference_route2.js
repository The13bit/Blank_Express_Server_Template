/**
 * -----------------------------------------------------------------------------
 * WARNING: This code base is obsolete and is only for reference purposes.
 * Please do not use this for any active development.
 * -----------------------------------------------------------------------------
 */
import express from 'express';

import { login, logout, register } from '../Controller/Ref_Controller2.js';

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

// router.route("/me").get(auth,getUserProfile);   note to check for auth use this format 

export default router;

