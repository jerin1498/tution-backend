const Post = require("../models/post");
const ModelService = require("./modelService");

class PostService extends ModelService {
  constructor(model) {
    super(model);
  }
}

module.exports = new PostService(Post);
