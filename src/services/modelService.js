class ModelService {
  constructor(model) {
    this.model = model;
  }

  create(args) {
    return this.model.create(args);
  }

  findOne(args) {
    return this.model.findOne(args);
  }

  findAll(query = {}) {
    return this.model.find(query);
  }
}

module.exports = ModelService;
