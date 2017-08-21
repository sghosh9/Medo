(function() {

  var app = angular.module('medo');

  app.controller('userController', ['$scope', '$rootScope', '$cookies', '$location', 'medoServices', 'userAPI', function($scope, $rootScope, $cookies, $location, medoServices, userAPI){
    if ($rootScope.loggedin) {
      // $location.path('/');
    }

    this.userLogin = function(name, password) {
      userAPI.Login(name, password)
        .then(function(response) {

          var user_data = response.data.current_user;
          user_data.csrf_token = response.data.csrf_token;
          user_data.logout_token = response.data.logout_token;
          userAPI.setSession(name, password, user_data);

          medoServices.showMsg('You have been logged in.', 1000);
          $location.path('/');
        },function(error){
          console.log(error);
          var error_message = (error.data.message) ? error.data.message : 'There was an error logging you in, let\'s try again!';
          medoServices.showMsg(error_message);
        });
    };
    this.userLogout = function() {
      // userAPI.getSession()
      //   .then(function(response) {
      //     console.log(response);
      //   },function(error){
      //     console.log(error);
      //     // var error_message = (error.data.message) ? error.data.message : 'There was an error refreshing the list';
      //     // medoServices.showMsg(error_message, 2000);
      //   });
      userAPI.Logout($rootScope.global.current_user.logout_token, $rootScope.global.current_user.csrf_token)
        .then(function(response) {
          console.log(response);
          userAPI.endSession();
          medoServices.showMsg('You have been logged out.', 1000);
          $location.path('/user');
        },function(error){
          console.log(error);
          var error_message = (error.data.message) ? error.data.message : 'There was an error logging you out, let\'s try again!';
          medoServices.showMsg(error_message);
        });
    };
    this.userRegister = function(name, email, password) {
      userAPI.userRegister(name, email, password)
        .then(function(response) {
          medoServices.showMsg('Account has been created.');
        },function(error){
          console.log(error);
          var error_message = (error.data.message) ? error.data.message : 'There was an error creating the account';
          medoServices.showMsg(error_message);
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
      };
      return $http.post(urlBase + '/user/register?_format=json', body, configs);
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
      };
      return $http.post(urlBase + '/user/login?_format=json', body, configs);
    };
    userAPI.Logout = function(logout_token, csrf_token) {
      delete $http.defaults.headers.common.Authorization;
      // delete $http.defaults.headers.common.X-CSRF-Token;
      var configs = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      // var params = '&token=' + logout_token;
      // var params = '&csrf_token=' + csrf_token;
      return $http.get(urlBase + '/user/logout?_format=json', configs);
    };
    userAPI.getSession = function() {
      var configs = {
        headers: {}
      };
      return $http.get(urlBase + '/rest/session/token?_format=json', configs);
    };
    userAPI.setSession = function(name, password, user_data) {
      var authData = btoa(name + ':' + password);
      user_data.auth = authData;
      $rootScope.global = {
        current_user: user_data
      };
      $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;
      $http.defaults.headers.common['X-CSRF-Token'] = $rootScope.global.current_user.csrf_token;
      $http.defaults.headers.common['withCredentials'] = true;
      $cookies.putObject('global', $rootScope.global);
      $rootScope.loggedin = true;
    };
    userAPI.endSession = function() {
      // $rootScope.global
      // $rootScope.loggedin = true;
      // $cookies.putObject('global', $rootScope.global);
    };


    return userAPI;
  }]);

}());
