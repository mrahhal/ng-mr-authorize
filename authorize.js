(function () {
	'use strict';

	angular
		.module('mr.authorize', ['ui.router'])
		.provider('authorize', function () {
			var self = this;

			this._authed = function (authed) {
				return !!this.authed();
			};

			this._policies = function (policies) {
				return this.policies();
			};

			this.$get = function ($state) {
				function check(policy) {
					var cp = self._policies();
					if (cp) {
						for (var i = 0; i < cp.length; i++) {
							if (cp[i].toUpperCase() === policy.toUpperCase()) {
								return true;
							}
						}
					}
					return false;
				}

				function authroizeCore(auth) {
					if (!auth) {
						return true;
					}

					if (!self._authed()) {
						// Unauthorized
						return 401;
					}

					if (auth.policies) {
						var policies = auth.policies,
							allow = false;
						for (var i = 0; i < policies.length; i++) {
							if (check(policies[i])) {
								allow = true;
							}
						}
						if (!allow) {
							// Forbidden
							return 403;
						}
					}

					return true;
				}

				function findParent(state) {
					var i = state.name.lastIndexOf('.');
					if (i < 0) {
						return null;
					}
					var parentName = state.name.substring(0, i);
					return $state.get(parentName);
				}

				function withAncestors(state) {
					var ancestors = [],
						pivot = state;

					while (true) {
						ancestors.push(pivot);
						var parent = findParent(pivot);
						if (!parent) {
							break;
						}
						pivot = parent;
					}

					return ancestors;
				}

				function extract(state) {
					var auth = state.auth;
					if (!auth) {
						return null;
					}

					// auth: true
					if (auth === true) {
						return true;
					}

					// auth: ['policy1', 'policy2']
					if (angular.isArray(auth)) {
						return {
							policies: auth
						};
					}

					// auth: 'policy3'
					if (angular.isString(auth)) {
						return {
							policies: [auth]
						};
					}

					if (!angular.isObject(auth)) {
						throw new Error('auth property is invalid in the state: "' + state.name + '".');
					} else {
						// auth: {
						//   policies: ...
						// }
						return auth;
					}
				}

				return function (state) {
					if (angular.isString(state)) {
						state = $state.get(state);
					}
					if (!state) throw new Error('state undefined.');

					var states;
					// Optimize for states without parents.
					if (state.name.lastIndexOf('.') < 0) {
						states = [state];
					} else {
						// Get all states
						states = withAncestors(state);
					}

					for (var i = 0; i < states.length; i++) {
						var result,
							auth = extract(states[i]);
						if ((result = authroizeCore(auth)) !== true) {
							// Authorization failed, break out.
							return result;
						}
						if (auth && auth.override) {
							break;
						}
					}

					return true;
				};
			};
		});
})();
