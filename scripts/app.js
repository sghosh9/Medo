(function() {
  var app = angular.module('medo', []);

  // var medo_items = [
  //   {
  //     'title': 'Eat'
  //   },
  //   {
  //     'title': 'Sleep'
  //   },
  //   {
  //     'title': 'Cry'
  //   }
  // ];

  app.controller('MEDOCtrl', ['$scope', '$http', 'MEDOapi', function($scope, $http, MEDOapi){
    // Test
    // $scope.items = medo_items;

    $scope.items = [];

    MEDOapi.getList()
      .then(function(response) {
        $scope.items = response.data;
      },function(error){
        console.log(error);
      });

    this.addNew = function(item) {
      var newItem = {'title' : item};
      $scope.items.push(newItem);
      this.newitem = '';
    };
    this.removeItem = function(index) {
      $scope.items.splice(index, 1);
    };
    this.editItem = function(index) {
      this.editVal = $scope.items[index].title;

    };
    this.updateSave = function(index, item) {
    };
    this.updateCancel = function(index) {
      $scope.items[index].title = this.editVal;
    };
  }]);

  app.factory('MEDOapi', ['$http', function ($http) {
    var urlBase = 'http://local.d8.com';
    var MEDOapi = {};

    MEDOapi.getList = function() {
      return $http.get(urlBase + '/' + 'todo-list');
    };

    return MEDOapi;
  }])

}());
