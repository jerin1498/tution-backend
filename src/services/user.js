const User = require("../models/user");
const ModelService = require("./modelService");

class UserService extends ModelService {
  constructor(model) {
    super(model);
  }
}

module.exports = new UserService(User);
