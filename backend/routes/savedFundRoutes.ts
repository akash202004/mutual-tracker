import express from 'express';
import {
  getSavedFunds,
  saveFund,
  removeFund,
  isFundSaved,
  updateFundNav,
} from "../controllers/savedFundController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.use(auth);
router.get("/", getSavedFunds);
router.post("/", saveFund);
router.get("/check/:schemeCode", isFundSaved);
router.delete("/:schemeCode", removeFund);
router.patch("/:schemeCode/nav", updateFundNav);

export default router;
