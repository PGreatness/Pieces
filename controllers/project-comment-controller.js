const ProjectComment = require('../models/project-comment-model');
const mongoose = require('mongoose');

// Create a new comment
var createComment = function(req, res) {
    // Create a new comment
    const { projectId, userId, text } = req.body;
    const dateCreated = new Date();
    if (!projectId || !userId || !text) {
        return res
        .status(400)
        .json({ message: "Missing required fields" });
    }
    const newComment = new ProjectComment({
        projectId,
        userId,
        text,
        dateCreated,
    });
    newComment.save()
    .then((comment) => {
        return res
        .status(200)
        .json(comment);
    })
    .catch((err) => {
        return res
        .status(500)
        .json({ message: "Error creating comment" });
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

module.exports = {
    createComment,
    deleteComment,
    deleteCommentsOfProject,
    getComments,
};