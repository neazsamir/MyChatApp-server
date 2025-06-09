import User from '../models/userSchema.model.js'
import Message from '../models/messageSchema.model.js'
import { v2 as cloudinary } from 'cloudinary'


export const getSidebarFriends = async (req, res, next) => {
	try {
		const myId = req.user._id
		const me = await User.findById(myId)
		const friends = await User.find({_id: {$in: me.friends}})
		return res.json({ success: true, friends })
	} catch (e) {
		console.log('Error getting sidebar friends: ', e)
		return next(e)
	}
}

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.user._id
		const friendId = req.params.id

		const messages = await Message.find({
			$or: [
				{ senderId: myId, recieverId: friendId },
				{ senderId: friendId, recieverId: myId }
			]
		})

		const updatePromises = messages.map((msg) => {
			if (msg.recieverId.toString() === myId.toString() && !msg.seen) {
				return Message.updateOne({ _id: msg._id }, { $set: { seen: true } })
			}
		})

		await Promise.all(updatePromises)

		return res.json({ success: true, messages })
	} catch (e) {
		console.log('Error getting messages: ', e)
		return next(e)
	}
}

export const sendMessage = async (req, res, next) => {
	try {
		const senderId = req.user._id
		const { image, text } = req.body
		const { recieverId } = req
		let imageUrl;
		if (image) {
			const uploadRes = await cloudinary.uploader.upload(image)
			imageUrl = uploadRes.secure_url
		}
		
		const newMessage = await Message.create({
			senderId,
			recieverId,
			text,
			image: imageUrl,
		})
		
		await User.updateOne({ _id: senderId }, { $addToSet: { friends: recieverId } });
		await User.updateOne({ _id: recieverId }, { $addToSet: { friends: senderId } });
		
		return res.status(201).json({ success: true, newMessage})
	} catch (e) {
		console.log('Error sending messages: ', e)
		return next(e)
	}
}

export const updateLastSeen = async (req, res, next) => {
	try {
		const _id = req.params.id
		const updatedUser = await User.updateOne({ _id }, {
			$set: { lastSeen: Date.now() }
		})
		if (updatedUser) {
			return res.json({ success: true, user: updatedUser})
		} else {
			return res.status(500).json({ success: false })
		}
	} catch (e) {
		console.log('Error updating last seen: ', e)
		return next(e)
	}
}

export const getLastMessage = async (req, res, next) => {
	try {
		const myId = req.user._id
		const friendId = req.params.id
		const lastMessage = await Message.findOne({
			$or: [
				{ senderId: myId, recieverId: friendId },
				{ senderId: friendId, recieverId: myId }
			]
		}).sort({createdAt: -1})
		return res.json({ success: true, lastMessage })
	} catch (e) {
		console.log('Error getting last message: ', e)
		return next(e)
	}
}

export const searchFriend = async (req, res, next) => {
	try {
		const { query } = req.query;

		const matchedFriends = await User.find(
			{
				$text: { $search: query.trim() },
				fullName: { $ne: req.user.fullName } // This should be in the filter, not projection
			}
		)
		.limit(10)
		.select("-password");

		return res.json({ success: true, matchedFriends });
	} catch (e) {
		console.log('Error searching friend: ', e);
		return next(e);
	}
};

export const getFriendData = async (req, res, next) => {
	try {
		const friendId = req.params.id
		const friendData = await User.findById(friendId).select('-password')
		return res.json({success: true, friendData})
	} catch (e) {
		console.log('Error searching friend: ', e);
		return next(e);
	}
}