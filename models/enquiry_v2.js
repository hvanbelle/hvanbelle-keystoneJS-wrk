var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	estatus: { type: String, default: 'active', required: true},
	enquiryType: { type: Types.Select, options: [
		{ value: '2014-01-01 - Fysiek - Zwembadtraining - Lebbeke', label: '2014-01-01 - Fysiek Zwembadtraining Lebbeke' },		
		{ value: '2014-01-02 - Fysiek - Zwembadtraining - Lebbeke', label: '2014-01-02 - Fysiek Zwembadtraining Lebbeke' },
		{ value: '2014-01-03 - Fysiek - Zwembadtraining - Lebbeke', label: '2014-01-03 - Fysiek Zwembadtraining Lebbeke' },		
		{ value: '2015-04-01 - Fysiek - Zwembadtraining - Lebbeke', label: '2015-04-01 - Fysiek Zwembadtraining Lebbeke' },
		{ value: '2015-04-02 - Fysiek - Zwembadtraining - Lebbeke', label: '2015-04-02 - Fysiek Zwembadtraining Lebbeke' },		
		{ value: '2015-04-03 - Fysiek - Zwembadtraining - Lebbeke', label: '2015-04-03 - Fysiek Zwembadtraining Lebbeke' },
		{ value: '2015-04-04 - Fysiek - Zwembadtraining - Lebbeke', label: '2015-04-04 - Fysiek Zwembadtraining Lebbeke' },
		{ value: 'other', label: 'Something else...' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	
	this.checkDoubleEnquiries();
	
	next();
});

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		//this.sendNotificationEmail();
		console.log('Nothing to report apart a post-save...');
	}
});

Enquiry.schema.methods.checkDoubleEnquiries = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	
	var enquiry = this;
	
	// 2DO: search enquiries collection 4 doubles	
	keystone.list('enquiries').model.find().where('email', 'elvanbelle@gmail.com').exec(function(err, enquiries_res) {
		
		if (err) return callback(err);
		
		// 2DO: Get all except last posted and change status of all except last
		
		enquiries_res.forEach(function(enquirie_res) {				
				
				console.log('pre - result_enquiries type: %s - status: %s', enquirie_res.enquiryType, enquirie_res.estatus);
				
				//console.log('this_enquiry: %s', enquiry);
				console.log('this_enquiry type: %s', enquiry.enquiryType);
				
				enquirie_res.estatus = 'not active';
				
				console.log('post - result_enquiries type: %s - status: %s', enquirie_res.enquiryType, enquirie_res.estatus);
				
				enquirie_res.save(function(err) {
						if (err) return callback(err);
						return;
					});
				
				
				/*
				rsvp.set({
						attending: req.body.attending
					}).save(function(err) {
						if (err) return res.apiResponse({ success: false, err: err });
						return res.apiResponse({ success: true });
					});
				
				*/
					
				
				/*
				// Load the counts for each category
				async.each(locals.data.categories, function(category, next) {
				
						keystone.list('Post').model.count().where('category').in([category.id]).exec(function(err, count) {
								category.postCount = count;
								next(err);
						});
				
				}, function(err) {
					next(err);
				});
				*/
				
				
				/*
				db.inventory.update(
					{ category: "clothing" },
					{
						$set: { category: "apparel" },
						$currentDate: { lastModified: true }
					},
					{ multi: true }
					)
				*/
				

				
				
				
			});
		
		
		
		//console.log('result_enquiries: %s', enquiries_res);
		//console.log('result_enquiries type: %s', enquiries_res.enquiryType);
		
	});
	
};

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	
	var enquiry = this;
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) { 
		
		if (err) return callback(err);
		
		new keystone.Email('enquiry-notification').send({
			to: admins,
			from: {
				name: 'hvanbelle',
				email: 'contact@hvanbelle.com'
			},
			subject: 'New Enquiry for hvanbelle',
			enquiry: enquiry
		}, callback);
		
	});
	
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'enquiryType|%30, name|20%, email|20%, estatus|10%';
Enquiry.register();
