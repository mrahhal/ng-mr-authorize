# ng-mr-authorize

Authorization service for ui-router in angular.

[![Travis](https://img.shields.io/travis/mrahhal/ng-mr-authorize/master.svg)](https://travis-ci.org/mrahhal/ng-mr-authorize)
[![Bower](https://img.shields.io/bower/v/ng-mr-authorize.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview
`mr.authorize` authorizes a state by looking inside of it for an `auth` property and tries to authorize the user based on that.

## Installation

```
bower install ng-mr-authorize --save
```

## Features
- Two kinds of authorization: basic (if authed or not) and policies.
- Child states inherit parent's auth object so you can specify authorization requirements on the parent and even extend them.

## Usage
First, referencing the module:

```js
angular.module('app', ['mr.authorize']);
```

Then you'll have to configure `authorizeProvider`:

```js
angular
    .module('app')
    .config(function (authorizeProvider) {
        // Both authed and policies functions will be injected.
        // 'storage' is a simple service you can implement that stores user credentials.

        authorizeProvider.authed = function (storage) {
            // return boolean: if user is authed
            return storage.authed();
        };

        authorizeProvider.policies = function () {
            // return array of strings: current user claimed policies
            return storage.policies();
        };
    });
```

Consider the following states:

```js
$stateProvider
    .state('foo', {
    })
    .state('foo.protected', {
        auth: true
    })
    ...
```

The final step:

```js
angular.module('app').run(function ($rootScope, $location, authorize) {
    $rootScope.$on('$stateChangeStart', function (e, to, params) {
        // We're providing the state to authorize, you can also provide its name
        var result = authorize(to);
        if (result !== true) {
            e.preventDefault();
            if (result === 401) {
                // 401 means unauthorized, so you probably want to redirect to login
                $state.go('login', { ReturnUrl: $location.path() });
            } else if (result === 403) {
                // 403 means forbidden, this practically means the user was authed but a policy requirement didn't match
                $state.go('access-denied');
            }
        }
    }
});
```

## All options
### The `auth` object:

```js
$stateProvider.state('foo', {
    auth: {
        authed: true, // require user to be authed
        policies: ['p1', 'p2'], // require one of the listed policies
        override: true // override parent state auth
    },
    ...
});
```

You can also use:
- `auth: true` as a shortcut for `auth: { authed: true }`
- `auth: 'p1'` as a shortcut for `auth: { policies: ['p1'] }`
- `auth: ['p1', 'p2']` as a shortcut for `auth: { policies: ['p1', 'p2'] }`

**Note:** `auth: { policies: ['p1'] }` is implicitly the same as `auth: { authed: true, policies: ['p1'] }`
