(function() {
  var app = angular.module('medo', ["ngRoute", "ngCookies"]);

  app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'list.html',
      controller: 'listController',
      controllerAs: 'listctrl'
    })
    .when('/user', {
      templateUrl: 'user.html',
      controller: 'userController',
      controllerAs: 'userctrl'
    })
    .when('/user/logout', {
      templateUrl: '',
      controller: 'userController',
      controllerAs: 'userctrl'
    })
    .otherwise({
      template: '<p class="text-center">Nothing to do here</p>'
    });

    // $httpProvider.defaults.headers.common.withCredentials = true;

    // $locationProvider.html5Mode(true).hashPrefix('!');

    // $httpProvider.interceptors.push(function($q, dependency1, dependency2) {
    //   return {
    //    'request': function(config) {
    //       console.log(config);
    //     },

    //     'response': function(response) {
    //       console.log(response);
    //     }
    //   };
    // });
  }]);

  app.run(['$rootScope', '$cookies', '$http', function ($rootScope, $cookies, $http) {
    $http.defaults.headers.common['withCredentials'] = true;

    $rootScope.showMsgFlag = false;
    $rootScope.message = '';
    $rootScope.global = {};
    $rootScope.loggedin = false;

    var globalCookies = $cookies.getObject('global');
    if (globalCookies) {
      $rootScope.loggedin = true;
      $rootScope.global = globalCookies;
      $http.defaults.headers.common['Authorization'] = 'Basic ' + globalCookies.current_user.auth;
      // $http.defaults.headers.common['X-CSRF-Token'] = $rootScope.global.current_user.csrf_token;
    }

  }]);

  app.service('medoServices', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    this.showMsg = function(message, visibleTime) {
      $rootScope.showMsgFlag = true;
      $rootScope.message = message;
      if (visibleTime) {
        $timeout(function() {
          $rootScope.showMsgFlag = false;
        }, visibleTime);
      }
    };
  }]);

}());
