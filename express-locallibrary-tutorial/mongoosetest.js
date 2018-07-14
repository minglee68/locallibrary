// Import Mongoose module and make Schema class
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Get default connection
var db = mongoose.connection

// make Schema for Author
var authorSchema = Schema({
	name : String,
	stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

// make Schema for Story
var storySchema = Schema({
	author : { type: Schema.Types.ObjectId, ref: 'Author' },
	title : String
});

// compile Story model and Author model from their own Schema
var Story = mongoose.model('Story', storySchema);
var Author = mongoose.model('Author', authorSchema);


var bob = new Author({ name : 'Bob Smith' });

bob.save(function(err) {
	if (err) return handleError(err);

	// Bob now exists, so start creating story
	var story = new Story({ 
		title : 'Bob goes Sledding',
		author : bob._id // assign the _id from our authro Bob. This ID is created by default!
	});

	story.save(function (err) {
		if (err) return handleError(err);
		// Bob now has his own story
	});
});

Story.findOne({ title : 'Bob goes Sledding' }).populate('author').exec(function (err, story){
	if (err) return handleError(err);

	console.log('The author is %s', story.author.name);
	// prints "The author is Bob smith
});
