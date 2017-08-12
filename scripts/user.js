(function() {

  var app = angular.module('medo');

  app.controller('userController', ['$scope', '$http', 'medoServices', 'userAPI', function($scope, $http, medoServices, userAPI){

    this.userLogin = function(name, password) {
      console.log(name);
      console.log(password);
    };
    this.userRegister = function(name, email, password) {
      console.log(name);
      console.log(email);
      console.log(password);
      userAPI.userRegister(name, email, password)
        .then(function(response) {
          console.log(response);
          medoServices.showMsg('Account has been created');
        },function(error){
          console.log(error);
          medoServices.showMsg('There was an error creating the account');
        });
    };
  }]);

  app.factory('userAPI', ['$http', function ($http) {
    var urlBase = 'http://local.d8.com';
    var userAPI = {};

    userAPI.userRegister = function(name, email, password) {
      var newItem = {
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
      return $http.post(urlBase + '/user/register', newItem, configs);
    };

    return userAPI;
  }]);

}());
