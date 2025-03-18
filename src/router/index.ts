import express from "express";
import { handleWebhook } from "../controllers/webhookController";
import ProfileController from "../controllers/profile";
import { auth } from "../auth";

const router = express.Router();
router.post("/synthflow/createAssistant"
    ,
);

router.get('/user-profile/:id', auth, ProfileController.getUserProfile)
router.post("/webhook/:id", handleWebhook);
export default router;