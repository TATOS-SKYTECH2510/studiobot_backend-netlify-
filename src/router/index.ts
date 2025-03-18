import express, { Request, Response } from "express";
const router = express.Router();
import { handleWebhook } from "../controllers/webhookController";

router.post("/synthflow/createAssistant"
    ,
);
router.post("/webhook/:id", handleWebhook);
export default router;