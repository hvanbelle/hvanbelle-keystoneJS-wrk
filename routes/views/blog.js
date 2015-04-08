var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: []
	};
	
	// Get the email of the logged on user
	//var ses_email = req.session.email = req.param('email');
	//var ses_email = req.body.signin_email;
	//var ses_email = req.email;
	//var ses_email = req.body.email;
	//var ses_email = req.body.userId;
	var ses_email = req.user.email;
	console.log('ses-email: %s', ses_email);
	/*
	List.schema.pre('save', function(next, done) {
			console.log('current user =>', this._user);
			next();
    });
	*/
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('PostCategory').model.find().sort('name').exec(function(err, results) {
		//keystone.list('Enquiry').model.find().sort('enquiryType').exec(function(err, results) {				
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.categories = results;
			
			//console.log('results: %s', results);
			
			// Load the counts for each category
			async.each(locals.data.categories, function(category, next) {
				
				keystone.list('Post').model.count().where('category').in([category.id]).exec(function(err, count) {
				//keystone.list('Enquiry').model.count().where('category').in([category.id]).exec(function(err, count) {
				//keystone.list('Enquiry').model.find().sort('enquiryType').exec(function(err, results) {
					category.postCount = count;
					//enquiryType.postCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current category filter
	view.on('init', function(next) {
		
		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
/*	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');
		
		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
*/
	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Enquiry').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('email', req.user.email)
			.sort('-createdAt');
		
			console.log('user: %s', '#{user.email}');
			console.log('user: %s', '{user.email}');
			
//		if (locals.data.category) {
//			q.where('categories').in([locals.data.category]);
//		}
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			
			//console.log('results: %s', results);
			
			next(err);
		});
		
	});	
	
	
	// Render the view
	view.render('blog');
	
};

