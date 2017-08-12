(function() {
  var app = angular.module('medo', ["ngRoute"]);

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

  app.run(['$rootScope', function ($rootScope) {
    $rootScope.showMsgFlag = false;
    $rootScope.message = '';
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
