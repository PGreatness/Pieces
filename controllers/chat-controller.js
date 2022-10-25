const Chat = require('../models/chat-model')
const mongoose = require('mongoose')

createChat = async (req, res) => {

    const body = req.body;
    if(!body) {
        return res.status(400).json({
            success: false,
            error: "No body was provided by the client."
        })
    }

    try {

        const { senderId, receiverId, msg, sentAt } = req.body
        
        if ( !senderId || !receiverId || !msg || !sentAt ) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        if (msg == "") {
            return res
                .status(400)
                .json({errorMessage: "Message can not be empty"});
        }
        
        let chat = new Chat({
            
            senderId: senderId,
            receiverId: receiverId,
            msg: msg,
            receiverSeen: false,
            sentAt: sentAt

        })

        if (!chat) {
            return res
                .status(400)
                .json({
                    errorMessage: "Ran into an error when creating Chat"
                });
        }

        chat
            .save()
            .then(() => {
            return res.status(201).json({
                success: true,
                chat: chat,
                message: 'Chat was successfully created.'
            })
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Chat was not created.'
                })
            })

    }
    catch (error) {
        console.log(error)
        res.status(500).send()
    }

}

deleteChat = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.query.id)
    let senderObjectId = mongoose.Types.ObjectId(req.query.senderId)

    Chat.findById({ _id: id }, (err, chat) => {

        // Checks if Chat with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Chat not found',
            })
        }

        // Checks if Chat belongs to the User who is trying to delete it
        if (!chat.senderId.equals(senderObjectId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Chat',
            })
        }

        // Finds Chat with given id and deletes it
        Chat.findByIdAndDelete(id, (err, chat) => {
            return res.status(200).json({
                success: true,
                data: chat
            })
        }).catch(err => console.log(err))

    })

}

markChatAsSeen = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.query.id)

    // Checks if request contains any body data
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was given by the client",
        })
    }

    Chat.findOne({ _id: id}, async (err, chat) => {

        // Checks if Chat exists
        if (err) {
            return res.status(404).json({
                err, 
                message: "Chat not found"
            })
        }

        // Sets to seen
        chat.receiverSeen = true        

        // Attempts to save updated Chat
        chat
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: chat._id,
                    message: 'Chat was successfully updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Chat was not updated',
                })
            })
        
    })

}

fetchChat = async (req, res) => {

    // Fetches Chats with the given senderId and receiverId
    let senderId = mongoose.Types.ObjectId(req.query.senderId)
    let receiverId = mongoose.Types.ObjectId(req.query.receiverId)

    try {

        await Chat.find({ senderId: senderId , receiverId: receiverId}, (err, chats) => {
        
            let chatsData = []

            if (err) {
                return res.status(400).json({ 
                    success: false,
                    error: err 
                })
            }

            if (!chats) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        error: "Chats could not be found"
                    })
            }
            else {
                
                // Adds data to return array
                for (key in chats) {

                    let chat = chats[key]
                    console.log(chat) 

                    let chatData = {
                        _id: chat._id,
                        senderId: chat.senderId,
                        receiverId: chat.receiverId,
                        msg: chat.msg,
                        receiverSeen: chat.receiverSeen,
                        sentAt: chat.sentAt
                    }
                    chatsData.push(chatData)

                }
            }

            return res.status(200).json({
                success: true,
                chats: chatsData
            })
        
        }).catch(err => console.log(err));

    }
    catch (error) {
        console.log(error)
        res.status(500).send()
    }

}

module.exports = {
    createChat,
    deleteChat,
    markChatAsSeen,
    fetchChat
}