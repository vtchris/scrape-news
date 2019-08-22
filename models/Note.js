var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
var NoteSchema = new Schema({
  // `title` is of type String
  articleId: String,
  // `body` is of type String
  text: String,
  // `date_stamp` is of type Date
  date_stamp: {
    type: Date,
    default: Date.now
}
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
