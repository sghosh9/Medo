(function() {
  var app = angular.module('medo', ["ngRoute", "ngCookies"]);

  app.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'list.html',
      controller: 'listController',
      controllerAs: 'listctrl'
    })
    .when('/user', {
      templateUrl: 'user.html',
      controller: 'userController'
    })
    .otherwise({
      template: '<p class="text-center">Nothing to do here</p>'
    });
  });

  app.run(['$rootScope', '$cookies', '$http', function ($rootScope, $cookies, $http) {

    $rootScope.showMsgFlag = false;
    $rootScope.message = '';
    $rootScope.global = {};

    var globalCookies = $cookies.getObject('global');
    if (globalCookies) {
      $rootScope.global = globalCookies;
      $http.defaults.headers.common['Authorization'] = 'Basic ' + globalCookies.current_user.auth;
    }

  }])

  app.service('medoServices', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    this.showMsg = function(message) {
      $rootScope.showMsgFlag = true;
      $rootScope.message = message;
      $timeout(function() {
        $rootScope.showMsgFlag = false;
      }, 2000);
    };
  }])

}());
