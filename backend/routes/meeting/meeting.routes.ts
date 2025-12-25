import { Router } from "express";
import { meetingHistory, meetingLatestActive, sendMessage, teacherSeen } from "../../controllers/meetings/meeting.controller";
import auth from "../../middleware/auth";

const router =  Router()

router.post('/',auth ,sendMessage)
router.post('/:id/seen',teacherSeen)
router.get('/active',meetingLatestActive)
router.get('/history',meetingHistory)

export default router