describe('authorize', function () {
	var authed = false,
		policies = [],
		authorize;

	beforeEach(module('mr.authorize', function ($provide, authorizeProvider, $stateProvider) {
		authorizeProvider.authed = function () {
			return authed;
		};
		authorizeProvider.policies = function () {
			return policies;
		};

		$stateProvider
			.state('home', {})
			.state('home.sub', {})
			.state('home.protected', {
				auth: true
			})
			.state('protected1', {
				auth: true
			})
			.state('protected1.sub', {})
			.state('protected1.override', {
				auth: {
					override: true
				}
			})
			.state('protected2', {
				auth: 'p1'
			})
			.state('protected2.sub', {})
			.state('protected3', {
				auth: ['p1']
			})
			.state('protected3.sub', {})
			.state('protected4', {
				auth: {
					policies: ['p1', 'p2']
				}
			});
	}));

	beforeEach(inject(function (_authorize_) {
		authorize = _authorize_;
	}));

	beforeEach(function () {
		authed = false;
		policies = [];
	});

	it('should pass with no protection', function () {
		expect(authorize('home')).toBe(true);
	});

	it('should pass with protection and authed', function () {
		authed = true;
		expect(authorize('protected1')).toBe(true);
	});

	it('should pass with protection and override', function () {
		expect(authorize('protected1.override')).toBe(true);
	});

	it('should 401 with protection', function () {
		expect(authorize('protected1')).toBe(401);
	});
});
