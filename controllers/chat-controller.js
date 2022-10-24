const Chat = require('../models/chat-model')

createChat = async (req, res) => {

    const body = req.body;
    if(!body) {
        return res.status(400).json({
            success: false,
            error: "No body was provided by the client."
        })
    }

    try {

        const { _id, senderId, receiverId, msg, receiverSeen, sentAt } = req.body
        
        if ( !_id || !senderId || !receiverId || !msg || !receiverSeen || !sentAt ) {
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
            
            _id: _id,
            senderId: senderId,
            receiverId: receiverId,
            msg: msg,
            receiverSeen: receiverSeen,
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

    Chat.findById({ _id: req.params.id }, (err, chat) => {

        // Checks if Chat with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Chat not found',
            })
        }

        // Checks if Chat belongs to the User who is trying to delete it
        if (chat.senderId != req.params.senderId) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Chat',
            })
        }

        // Finds Chat with given id and deletes it
        Chat.findByIdAndDelete(req.params.id, (err, chat) => {
            return res.status(200).json({
                success: true,
                data: chat
            })
        }).catch(err => console.log(err))

    })

}

markChatAsSeen = async (req, res) => {

    // Checks if request contains any body data
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was given by the client",
        })
    }

    Chat.findOne({ _id: req.params.id }, async (err, chat) => {

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
    const { senderId, receiverId } = req.query;
    await Chat.find({ senderId: senderId, receiverId: receiverId }, (err, chats) => {
    
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
            let chatsData = [];
            for (key in chats) {

                let chat = chats[key]
                let chatData = {

                    _id: chat._id,
                    senderId: chat._senderId,
                    receiverId: chat._receiverId,
                    msg: chat._msg,
                    receiverSeen: chat._receiverSeen,
                    seenAt: chat._seenAt

                }

                chatsData.push(chatData)

            }
            return res.status(200).json({
                success: true,
                chats: chatsData
            })
        }
    }).catch(err => console.log(err));

}