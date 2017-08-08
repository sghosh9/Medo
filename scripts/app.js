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

  app.controller('MEDOCtrl', ['$scope', '$http', '$timeout', 'MEDOapi', function($scope, $http, $timeout, MEDOapi){
    // Test
    // $scope.items = medo_items;

    $scope.items = [];
    $scope.editVal = '';
    $scope.showMsgFlag = false;

    $scope.refreshList = function() {
      MEDOapi.getList()
        .then(function(response) {
          $scope.items = response.data;
        },function(error){
          console.log(error);
        });
    };
    this.addNew = function(item) {
      var newItem = {'title' : item};
      $scope.items.push(newItem);
      this.newitem = '';
    };
    this.removeItem = function(index) {
      MEDOapi.removeItem($scope.items[index].nid)
        .then(function(response) {
          console.log(response);
          $scope.refreshList();
          $scope.showMsg($scope.items[index].title + ' has been removed.');
        },function(error){
          console.log(error);
        });
    };
    this.editItem = function(index) {
      $scope.editVal = $scope.items[index].title;
    };
    this.updateSave = function(index, item) {
    };
    this.updateCancel = function(index) {
      $scope.items[index].title = $scope.editVal;
    };
    $scope.showMsg = function(message) {
      $scope.showMsgFlag = true;
      $scope.message = message;
      $timeout(function() {
        $scope.showMsgFlag = false;
      }, 5000);
    };

    $scope.refreshList();

  }]);

  app.factory('MEDOapi', ['$http', function ($http) {
    var urlBase = 'http://local.d8.com';
    var MEDOapi = {};

    MEDOapi.getList = function() {
      return $http.get(urlBase + '/todo-list');
    };
    MEDOapi.addItem = function(data) {
      return $http.post(urlBase + '/entity/node');
    };
    MEDOapi.removeItem = function(nid) {
      return $http.delete(urlBase + '/node/' + nid);
    };

    return MEDOapi;
  }])

}());
