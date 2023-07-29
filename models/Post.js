const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = mongoose.model('posts', PostSchema);
