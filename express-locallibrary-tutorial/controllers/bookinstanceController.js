var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/my_database';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// display list of all BookInstances
exports.bookinstance_list = function(req, res, next){
	BookInstance.find().populate('book').exec(function (err, list_bookinstances) {
		if (err) { return next(err); }
		// successful, so render
		res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
	});
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res){
	BookInstance.findById(req.params.id).populate('book').exec(function(err, bookinstance){
		if (err) { return next(err) }
		if (bookinstance==null){ // No Results
			var err = new Error('Book copy not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render
		res.render('bookinstance_detail', {title: 'Book', bookinstance: bookinstance});
	});
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next){
	Book.find({}, 'title').exec(function(err, books){
		if (err) { return next(err) }
		// successful, so render
		res.render('bookinstance_form', {title: 'Create BookInstance', book_list:books});
	});
};

// Display BookInstance create on POST
exports.bookinstance_create_post = [
	// Validate fields.
	body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
	body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
	body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

	// Sanitize fields.
	sanitizeBody('book').trim().escape(),
	sanitizeBody('imprint').trim().escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('due_back').toDate(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a BookInstance object with escaped and trimmed data
		var bookinstance = new BookInstance({
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			due_back: req.body.due_back
		});

		if(!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values and error messages
			Book.find({}, 'title').exec(function(err, books){
				if (err) { return next(err); }
				// successful, so render
				res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookintance.book_id, errors: errors.array(), bookinstance: bookinstance});
			});
			return;
		} else {
			bookinstance.save(function (err){
				if (err) { return next(err); }
				// successful, redirect to new record.
				res.redirect(bookinstance.url);
			});
		}
	}
];

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Display BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Display BookInstance update on POST
exports.bookinstance_update_post = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance update POST');
};
