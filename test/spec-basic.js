describe('authorize', function() {
	var authed = false,
		policies = [];

	beforeEach(module('mr.authorize', function ($provide, authorizeProvider) {
		authorizeProvider.authed = function () { return authed; };
		authorizeProvider.policies = function () { return policies; };

		$provide.value('$state', {
			get: function () {
				return [{
					name: 'home'
				}, {
					name: 'art'
				}, {
					name: 'art.sub'
				}, {
					name: 'protected1',
					auth: true
				}, {
					name: 'protected1.sub',
				}, {
					name: 'protected2'
				}, {
					name: 'protected2.sub',
					auth: true
				}, {
					name: 'protected3',
					auth: 'p1'
				}, {
					name: 'protected4',
					auth: ['p1']
				}, {
					name: 'protected5',
					auth: {
						policies: ['p1', 'p2']
					}
				}];
			}
		});
	}));

	it('should pass with no protection', inject(function(authorize) {
		expect(authorize({ name: 'home'} )).toBe(true);
	}));
});
