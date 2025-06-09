import { Router } from 'express'
import { protectRoute } from '../middlewares/protectRoute.middleware.js'
import * as mc from '../controllers/message.controller.js'
import validateReciever from '../middlewares/validateReciever.middleware.js'


const router = Router()

router.get("/friends", protectRoute, mc.getSidebarFriends)
router.get("/searchFriend", protectRoute, mc.searchFriend)
router.get("/friendData/:id", protectRoute, mc.getFriendData)
router.get("/lastMessage/:id", protectRoute, mc.getLastMessage)
router.patch("/lastSeen/:id", protectRoute, mc.updateLastSeen)
router.route("/:id").get(protectRoute, mc.getMessages).post(protectRoute, validateReciever, mc.sendMessage)

export default router;