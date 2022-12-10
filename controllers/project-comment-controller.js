const ProjectComment = require('../models/project-comment-model');
const mongoose = require('mongoose');

// Create a new comment
var createComment = function(req, res) {
    // Create a new comment
    const { projectId, userId, text } = req.body;
    if (!projectId || !userId || !text) {
        return res
        .status(400)
        .json({ message: "Missing required fields" });
    }
    let ownerObjectId = mongoose.Types.ObjectId(userId)
    let projectObjectId = mongoose.Types.ObjectId(projectId)
    const newComment = new ProjectComment({
        projectId: projectObjectId,
        userId: ownerObjectId,
        text,
        likes: [],
        dislikes: [],
    });
    newComment.save()
    .then((comment) => {
        return res
        .status(200)
        .json({
            success: true,
            comment: comment
        });
    })
    .catch((err) => {
        console.log(err);
        return res
        .status(500)
        .json({
            success: false,
            message: "Error creating comment"
        });
    });
}

var deleteComment = function(req, res) {
    const { commentId } = req.body;
    if (!commentId) {
        return res
        .status(400)
        .json({ message: "Missing required fields" });
    }
    ProjectComment.deleteOne({ _id: commentId })
    .then((result) => {
        return res
        .status(200)
        .json(result);
    })
    .catch((err) => {
        return res
        .status(500)
        .json({ message: "Error deleting comment" });
    });
}

var getComments = function(req, res) {
    const { projectId } = req.body;
    if (!projectId) {
        return res
        .status(400)
        .json({ message: "Missing required fields" });
    }
    ProjectComment.find({ projectId })
    .then((comments) => {
        return res
        .status(200)
        .json(comments);
    })
    .catch((err) => {
        return res
        .status(500)
        .json({ message: "Error getting comments" });
    });
}

var deleteCommentsOfProject = function(req, res) {
    const { projectId } = req.body;
    if (!projectId) {
        return res
        .status(400)
        .json({ message: "Missing required fields" });
    }
    ProjectComment.deleteMany({ "projectId": projectId })
    .then((result) => {
        return res
        .status(200)
        .json(result);
    })
    .catch((err) => {
        return res
        .status(500)
        .json({ message: "Error deleting comments" });
    });
}

getCommentbyId = async (req, res) => {
    const savedComment = await ProjectComment.findById(req.params.id);
    console.log(savedComment)
    return res.status(200).json({
        comment: savedComment
    });
}

updateComment = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.query.id)
    let ownerObjectId = mongoose.Types.ObjectId(req.query.ownerId)

    // Checks if request contains any body data
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was given by the client",
        })
    }

    ProjectComment.findOne({ _id: id }, async (err, comment) => {

        // Checks if comment exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Comment not found"
            })
        }

        if (!comment) {
            return res.status(404).json({
                message: 'comment not found'
            })
        }

        // Changes all the present fields
        const { _id, text, likes, dislikes } = req.body;
        if (text) {
            // Checks if comment belongs to the User who is trying to delete it
            if (!comment.ownerId.equals(ownerObjectId)) {
                return res.status(401).json({
                    err,
                    message: 'User does not have ownership of this comment',
                })
            }
            if (text == "") {
                text = "Comment left blank."
            }
            comment.text = text
        }
        if (likes)
            comment.likes = likes
        if (dislikes)
            comment.dislikes = dislikes

        // Attempts to save updated comment
        comment
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: comment._id,
                    comment: comment,
                    message: 'Comment was successfully updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Comment was not updated',
                })
            })


        //
    })

}


getProjectComments = async (req, res) => {
    const comments = await ProjectComment.find({projectId: req.params.id});
    
    return res.status(200).json({
        success: true,
        comments: comments
    })
}

getAllProjectCommentsOnPage = async (req, res) => {
    var { page } = req.query;
    var { limit } = req.body;

    if (!page) {
        page = 1;
    }

    if (!limit) {
        limit = 10;
    }

    if (Number.isNaN(+page) || Number.isNaN(+limit)) {
        return res.status(400).json({
            success: false,
            error: "Page and limit must be numbers"
        })
    }

    page = +page;
    limit = +limit;

    if (page < 1) {
        return res.status(400).json({
            success: false,
            error: "Page must be greater than 0"
        })
    }

    if (limit < 1) {
        return res.status(400).json({
            success: false,
            error: "Limit must be greater than 0"
        })
    }

    const startIndex = page > 0 ? (page - 1) * limit : 0;
    limit = Number(limit);
    const rangeComments = await ProjectComment.aggregate([
        { $skip : startIndex },
        { $limit: limit },
        // { $sort: { createdAt: -1 } },
    ])
    return res.status(200).json({
        success: true,
        count: rangeComments.length,
        comments: rangeComments
    });
}

module.exports = {
    createComment,
    deleteComment,
    deleteCommentsOfProject,
    getComments,
    getCommentbyId,
    updateComment,
    getProjectComments,
    getAllProjectCommentsOnPage
};