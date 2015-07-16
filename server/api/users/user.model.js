'use strict'; 

var mongoose = require('mongoose'),
	shortid = require('shortid'),
	crypto = require('crypto'),
	_ = require('lodash');

var db = require('../../db');
var Story = require('../stories/story.model');

var generateSalt = function(){
	var saltBuffer = crypto.randomBytes(16)
    return saltBuffer.toString('base64');
}

var User = new mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate
	},
	name: String,
	photo: String,
	phone: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	hashedPassword: String,
	salt: {
		type: String,
		default: generateSalt()
	}
});

User
    .virtual('password')
    .set(function (plaintext) { 	
        this.hashedPassword = crypto.pbkdf2Sync(plaintext, '', 0, 64).toString('base64');
    });

var bool = null

User.methods.authenticate = function (credentials, cb){
	var hashedPassword = crypto.pbkdf2Sync(credentials.password, '', 0, 64).toString('base64')
	
	this.constructor.findOne({email: credentials.email, hashedPassword: hashedPassword}, function(err, userProfile){
		if (err) return err
		if (userProfile) bool = true
		cb(err, bool)
	})
}

User.statics.findByEmails = function (set) {
	return this.find({emails: {$elemMatch: {$in: set}}});
};

User.statics.findByEmail = function (email) {
	return this.findOne({emails: {$elemMatch: {$eq: email}}});
};

User.methods.getStories = function () {
	return Story.find({author: this._id}).exec();
};

module.exports = db.model('User', User);