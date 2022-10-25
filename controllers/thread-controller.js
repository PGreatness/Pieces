const Thread = require('../models/thread-model')
const Reply = require('../models/reply-model')

createThread = async (req, res) => {

    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was provided by the client."
        })
    }

    try {

        // Get data from request
        const { _id, threadName, threadText, senderId, sentAt } = req.body;

        if (!_id || !threadName || !threadText || !senderId || !sentAt) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
    
        if (threadName == "") {
            return res
                .status(400)
                .json({ errorMessage: "Thread name can not be empty" });
        }
        if (threadText == "") {
            return res
                .status(400)
                .json({ errorMessage: "Thread text can not be empty" });
        }
        if (threadText.length > 2500) {
            return res
                .status(400)
                .json({ errorMessage: "Thread text is over the limit of 2500 characters" });
        }
        if (threadName.length > 250) {
            return res
                .status(400)
                .json({ errorMessage: "Thread title is over the limit of 250 characters" });
        }

        // Creates Thread
        let thread = null
        thread = new Thread({
            
            _id: _id,
            threadName: threadName,
            threadText: threadText,
            senderId: senderId,
            sentAt: sentAt,
            replies: []

        })

        if (!thread) {
            return res
                .status(400)
                .json({
                    errorMessage: "Ran into an error when creating Thread"
                });
        }

        // Saves Thread
        thread
            .save()
            .then(() => {
            return res.status(201).json({
                success: true,
                thread: thread,
                message: 'Thread was successfully created.'
            })
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Thread was not created.'
                })
            })

    }
    catch (error) {
        console.log(error)
        res.status(500).send()
    }

}

deleteThread = async (req, res) => {

    Thread.findById({ _id: req.params.id }, (err, thread) => {

        // Checks if Thread with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Thread not found',
            })
        }

        // Checks if Thread belongs to the User who is trying to delete it
        if (thread.senderId != req.params.senderId) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Thread',
            })
        }

        // Finds Thread with given id and deletes it
        Thread.findByIdAndDelete(req.params.id, (err, thread) => {
            return res.status(200).json({
                success: true,
                data: thread
            })
        }).catch(err => console.log(err))

    })

}

addReplyToThread = async (req, res) => {

    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was provided by the client."
        })
    }

    Thread.findById({ _id: req.params.id }, (err, thread) => {

        // Checks if Thread with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Thread not found',
            })
        }

        // Add reply to Thread
        const { reply } = req.body
        thread.replies.push(reply)

        thread
            .save()
            .then(() => {
            return res.status(201).json({
                success: true,
                thread: thread,
                message: 'Thread was successfully updated.'
            })
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Thread was not updated.'
                })
            })

    })

}

removeReplyFromThread = async (req, res) => {

    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was provided by the client."
        })
    }

    Thread.findById({ _id: req.params.id }, (err, thread) => {

        const { replyId } = req.body

        // Checks if Thread with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Thread not found',
            })
        }

        // Remove reply from Thread
        let replies = thread.replies
        for (let i = 0; i < replies.length; i++) {
            let reply = replies[i]
            if (reply._id == replyId) {
                replies.splice(i, 1)
                break;
            }
        }

        // Save Thread with new replies
        thread.replies = replies
        thread
            .save()
            .then(() => {
            return res.status(201).json({
                success: true,
                thread: thread,
                message: 'Thread was successfully updated.'
            })
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Thread was not updated.'
                })
            })

    })

}

module.exports = {
    createThread,
    deleteThread
}