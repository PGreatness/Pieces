const Thread = require('../models/thread-model')
const Reply = require('../models/reply-model')
const User = require('../models/user-model')
const mongoose = require('mongoose')

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
        const { threadName, threadText, senderId } = req.body;

        if (!threadName || !threadText || !senderId) {
            return res
                .status(400)
                .json({ message: "Please enter all required fields." });
        }

        if (threadName == "") {
            return res
                .status(400)
                .json({ message: "Thread name can not be empty" });
        }
        if (threadText == "") {
            return res
                .status(400)
                .json({ message: "Thread text can not be empty" });
        }
        if (threadText.length > 2500) {
            return res
                .status(400)
                .json({ message: "Thread text is over the limit of 2500 characters" });
        }
        if (threadName.length > 250) {
            return res
                .status(400)
                .json({ message: "Thread title is over the limit of 250 characters" });
        }

        // Creates Thread
        let thread = null
        thread = new Thread({

            threadName: threadName,
            threadText: threadText,
            senderId: senderId,
            likes: 0,
            dislikes: 0,
            replies: []

        })

        if (!thread) {
            return res
                .status(400)
                .json({
                    message: "Ran into an error when creating Thread"
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
        return res.status(500)
    }

}

deleteThread = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.query.id)
    let senderObjectId = mongoose.Types.ObjectId(req.query.senderId)

    Thread.findById({ _id: id }, (err, thread) => {

        // Checks if Thread with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Thread not found',
            })
        }

        // Checks if Thread belongs to the User who is trying to delete it
        if (!thread.senderId.equals(senderObjectId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Thread',
            })
        }

        // Finds Thread with given id and deletes it
        Thread.findByIdAndDelete(id, (err, thread) => {
            return res.status(200).json({
                success: true,
                data: thread
            })
        }).catch(err => console.log(err))

    })

}

var getAllThreads = async (req, res) => {
    var { page, limit } = req.query;

    if (!page) page = 1;

    if (limit && !Number.isNaN(+limit)) {
        limit = +limit;
    }

    if (Number.isNaN(+page)) {
        return res.status(400).json({
            success: false,
            error: "Page must be a number"
        })
    }

    page = +page;

    if (page < 1) {
        return res.status(400).json({
            success: false,
            error: "Page must be greater than 0"
        })
    }

    var startIndex;
    var threads;

    /**
     * THE CODE BELOW TRANSLATES TO:
        if (likes >= dislikes) {
            if (dislikes == 0) {
                return likes;
            }else{
                return likes/dislikes;
            }
        }else{
            if (likes == 0) {
                return -dislikes;
            }else{
                return -dislikes/likes;
            }
        }
    */
    const ratioLogic = {
        $cond: {
            if: { $gte: [ { $size: "$likes"}, { $size: "$dislikes" } ] },
            then: { $cond: {
                if: { $eq: [ { $size: "$dislikes" }, 0 ] },
                then: { $size: "$likes" },
                else: { $divide: [ { $size: "$likes" }, { $size: "$dislikes" } ] }
            }},
            else: { $cond: {
                if: { $eq: [ { $size: "$likes" }, 0 ] },
                then: { $subtract: [0, { $size: "$dislikes" }] },
                else: { $subtract: [0, { $divide: [ { $size: "$dislikes" }, { $size: "$likes" } ] }] }
            }}
        }
    };
    if (limit) {
        startIndex = (page - 1) * limit;
        threads = await Thread.aggregate([
            { $match: {} },
            { $addFields: {
                "ratio": { ratioLogic }
            }},
            { $sort: { "ratio": -1, createdAt: -1 } },
            { $skip: startIndex },
            { $limit: limit },
        ]);
    } else {
        startIndex = 0;
        threads = await Thread.aggregate([
            { $match: {} },
            { $addFields: {
                "ratio": { ratioLogic },
            }},
            { $sort: { "ratio": -1, createdAt: -1 } },
            { $skip: startIndex },
        ]);
    }

    return res.status(200).json({
        success: true,
        threads: threads
    })
}

getAllReplies = async (req, res) => {
    const rangeReplies = await Reply.find({})
    return res.status(200).json({
        success: true,
        count: rangeReplies.length,
        replies: rangeReplies
    });
}

var likeThread = async (req, res) => {
    const { threadId, userId } = req.body;
    var tid;
    var uid;
    if (!threadId || !userId) {
        return res.status(400).json({
            success: false,
            error: "No threadId or userId was provided by the client."
        })
    }
    try {
        tid = mongoose.Types.ObjectId(threadId);
        uid = mongoose.Types.ObjectId(userId);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: "Invalid threadId or userId"
        })
    }

    const thread = await Thread.findById(tid);
    if (!thread) {
        return res.status(404).json({
            success: false,
            error: "Thread not found"
        })
    }

    const user = await User.findById(uid);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: "User not found"
        })
    }

    if (thread.dislikes.includes(uid)) {
        thread.dislikes = thread.dislikes.filter(id => !id.equals(uid));
    }

    if (thread.likes.includes(uid)) {
        thread.likes = thread.likes.filter(id => !id.equals(uid));
        thread.save();
        return res.status(200).json({
            success: true,
            thread: thread,
            message: "Thread unliked"
        })
    }

    thread.likes.push(uid);
    thread.save().then(() => {
        return res.status(200).json({
            success: true,
            message: "Thread liked",
            thread: thread
        })
    });
}

var dislikeThread = async (req, res) => {
    const { threadId, userId } = req.body;
    var tid;
    var uid;
    if (!threadId || !userId) {
        return res.status(400).json({
            success: false,
            error: "No threadId or userId was provided by the client."
        })
    }
    try {
        tid = mongoose.Types.ObjectId(threadId);
        uid = mongoose.Types.ObjectId(userId);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: "Invalid threadId or userId"
        })
    }

    const thread = await Thread.findById(tid);
    if (!thread) {
        return res.status(404).json({
            success: false,
            error: "Thread not found"
        })
    }

    const user = await User.findById(uid);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: "User not found"
        })
    }

    if (thread.likes.includes(uid)) {
        thread.likes = thread.likes.filter(id => !id.equals(uid));
    }

    if (thread.dislikes.includes(uid)) {
        thread.dislikes = thread.dislikes.filter(id => !id.equals(uid));
        thread.save();
        return res.status(200).json({
            success: true,
            thread: thread,
            message: "Thread undisliked"
        })
    }

    thread.dislikes.push(uid);
    thread.save().then(() => {
        return res.status(200).json({
            success: true,
            message: "Thread disliked",
            thread: thread
        })
    });
}

addReply = async (req, res) => {

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

removeReply = async (req, res) => {

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

getReplybyId = async (req, res) => {
    const savedReply = await Reply.findById(req.params.id);
    console.log(savedReply)
    return res.status(200).json({
        reply: savedReply
    });
}

module.exports = {
    createThread,
    deleteThread,
    getAllThreads,
    getAllReplies,
    getReplybyId,
    addReply,
    removeReply,
    likeThread,
    dislikeThread,
}