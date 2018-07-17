var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
	first_name: {type: String, required: true, max: 100},
	family_name: {type: String, required: true, max: 100},
	date_of_birth: {type: Date},
	date_of_death: {type: Date},
});

// Virtual for author's fullname
AuthorSchema.virtual('name').get(function() {
	return this.family_name + ', ' + this.first_name;
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function() {
	return '/catalog/author/' + this._id;
});

AuthorSchema.virtual('lifespan').get(function() {
	var lifespan = ''
	if(this.date_of_birth)
		lifespan = moment(this.date_of_birth).format('MMMM Do, YYYY');
	if(this.date_of_death)
		lifespan = lifespan + ' - ' + moment(this.date_of_death).format('MMMM Do, YYYY');
	return lifespan
});

// Export model as model name 'Author'
module.exports = mongoose.model('Author', AuthorSchema);
