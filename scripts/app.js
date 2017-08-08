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
    $scope.editVal = '';

    $scope.refreshList = function() {
      MEDOapi.getList()
        .then(function(response) {
          $scope.items = response.data;
        },function(error){
          console.log(error);
        });
    };
    $scope.addNew = function(item) {
      var newItem = {'title' : item};
      $scope.items.push(newItem);
      this.newitem = '';
    };
    $scope.removeItem = function(index) {
      MEDOapi.removeItem($scope.items[index].nid)
        .then(function(response) {
          console.log(response);
          $scope.refreshList();
        },function(error){
          console.log(error);
        });
    };
    $scope.editItem = function(index) {
      $scope.editVal = $scope.items[index].title;
    };
    $scope.updateSave = function(index, item) {
    };
    $scope.updateCancel = function(index) {
      $scope.items[index].title = $scope.editVal;
    };

    $scope.refreshList();

  }]);

  app.factory('MEDOapi', ['$http', function ($http) {
    var urlBase = 'http://local.d8.com';
    var MEDOapi = {};

    MEDOapi.getList = function() {
      return $http.get(urlBase + '/todo-list');
    };

    MEDOapi.removeItem = function(nid) {
      return $http.delete(urlBase + '/node/' + nid);
    };

    return MEDOapi;
  }])

}());
