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
		{ value: '2015-04-01-fysiek-zwembadtraining-lebbeke', label: '2015-04-01 - Fysiek Zwembadtraining Lebbeke' },
		{ value: '2015-04-02-fysiek-zwembadtraining-lebbeke', label: '2015-04-02 - Fysiek Zwembadtraining Lebbeke' },		
		{ value: '2015-04-03-fysiek-zwembadtraining-lebbeke', label: '2015-04-03 - Fysiek Zwembadtraining Lebbeke' },
		{ value: '2015-04-04-fysiek-zwembadtraining-lebbeke', label: '2015-04-04 - Fysiek Zwembadtraining Lebbeke' },
		{ value: '2014-01-01 - Fysiek - Zwembadtraining - Lebbeke', label: '2014-01-01 - Fysiek Zwembadtraining Lebbeke' },		
		{ value: '2014-01-02 - Fysiek - Zwembadtraining - Lebbeke', label: '2014-01-02 - Fysiek Zwembadtraining Lebbeke' },
		{ value: '2014-01-03 - Fysiek - Zwembadtraining - Lebbeke', label: '2014-01-03 - Fysiek Zwembadtraining Lebbeke' },		
		{ value: 'mtl_2015-04-05', label: '2015-04-05 - Techniek Zwembadtraining Lebbeke' },
		{ value: 'mtl_2015-04-06', label: '2015-04-06 - Techniek Zwembadtraining Lebbeke' },		
		{ value: 'mtl_2015-04-07', label: '2015-04-07 - Techniek Zwembadtraining Lebbeke' },
		{ value: 'mtw_2015-04-08', label: '2015-04-08 - Techniek Zwembadtraining Wachtebeke' },
		{ value: 'mtw_2015-04-09', label: '2015-04-09 - Techniek Zwembadtraining Wachtebeke' },
		{ value: 'mtw_2015-04-10', label: '2015-04-10 - Techniek Zwembadtraining Wachtebeke' },		
		{ value: 'mtw_2015-04-11', label: '2015-04-11 - Techniek Zwembadtraining Wachtebeke' },
		{ value: 'mtw_2015-04-12', label: '2015-04-12 - Techniek Zwembadtraining Wachtebeke' },
		{ value: 'other', label: 'Something else...' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.checkDoubleEnquiries = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	
	var enquiry = this;
	
	console.log('Check 4 doubles - email: %s', req.user.email); // 2DO: req not known here !!! --> won't work

	// 2DO: search enquiries collection 4 doubles	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
		
		// 2DO: Get all except last posted and change status of all except last
		
		
		
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
Enquiry.defaultColumns = 'name, email, enquiryType';
Enquiry.register();
