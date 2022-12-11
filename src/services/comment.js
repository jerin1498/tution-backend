const Comment = require("../models/comment");
const ModelSevice = require("./modelService");

class CommentService extends ModelSevice {
  constructor(model) {
    super(model);
  }
}

module.exports = new CommentService(Comment);
