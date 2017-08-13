(function() {

  var app = angular.module('medo');

  app.controller('userController', ['$scope', '$rootScope', '$cookies', 'medoServices', 'userAPI', function($scope, $rootScope, $cookies, medoServices, userAPI){

    this.userLogin = function(name, password) {
      userAPI.Login(name, password)
        .then(function(response) {
          var user_data = response.data.current_user;
          user_data.csrf_token = response.data.csrf_token;
          user_data.logout_token = response.data.logout_token;
          userAPI.setSession(name, password, user_data);

          medoServices.showMsg('You have been logged in');
        },function(error){
          medoServices.showMsg('There was an error logging you in, let\'s try again!');
        });
    };
    this.userRegister = function(name, email, password) {
      userAPI.userRegister(name, email, password)
        .then(function(response) {
          medoServices.showMsg('Account has been created');
        },function(error){
          medoServices.showMsg('There was an error creating the account');
        });
    };
  }]);

  app.factory('userAPI', ['$rootScope', '$cookies', '$http', function ($rootScope, $cookies, $http) {
    var urlBase = 'http://local.d8.com';
    var userAPI = {};

    userAPI.userRegister = function(name, email, password) {
      var body = {
        _links: {
          type: {
            href: urlBase + "/rest/type/user/user"
          }
        },
        name: [{value: name}],
        mail: [{value: email}],
        pass: [{value: password}]
      };
      var configs = {
        headers: {
          "Content-Type": "application/hal+json"
        }
      }
      return $http.post(urlBase + '/user/register', body, configs);
    };
    userAPI.Login = function(name, password) {
      var body = {
        name: name,
        pass: password
      };
      var configs = {
        headers: {
          "Content-Type": "application/hal+json"
        }
      }
      return $http.post(urlBase + '/user/login?_format=json', body, configs);
    };
    userAPI.setSession = function(name, password, user_data) {
      var authData = btoa(name + ':' + password);
      user_data.auth = authData;
      $rootScope.global = {
        current_user: user_data
      };
      $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;
      $cookies.putObject('global', $rootScope.global);
    };


    return userAPI;
  }]);

}());
