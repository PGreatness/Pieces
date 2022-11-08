const { model, Schema, ObjectId } = require("mongoose");

const projectCommentSchema = new Schema({
    // The project that this comment is associated with
    // This can be a map or a tileset
    projectId: {
        type: ObjectId,
        required: true,
    },
    // The user that created this comment
    userId: {
        type: ObjectId,
        required: true,
    },
    // The text of the comment
    text: {
        type: String,
        required: true,
    },
    // The date that this comment was created
    dateCreated: {
        type: Date,
        required: true,
    },
});

const ProjectComment = model("ProjectComment", projectCommentSchema);
module.exports = ProjectComment;