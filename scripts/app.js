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
          $scope.showMsg('There was an error refreshing the list');
        });
    };
    this.addNew = function(item) {
      var newItem = {'title' : item};
      MEDOapi.addItem(item)
        .then(function(response) {
          // $scope.refreshList();
          $scope.items.push(newItem);
          $scope.newitem = '';
          $scope.showMsg(item + ' has been added.');
        },function(error){
          $scope.showMsg('There was an error adding the item');
        });
    };
    this.removeItem = function(index) {
      MEDOapi.removeItem($scope.items[index].nid)
        .then(function(response) {
          $scope.refreshList();
          $scope.showMsg($scope.items[index].title + ' has been removed.');
        },function(error){
          $scope.showMsg('There was an error removing the item');
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
      return $http.get(urlBase + '/todo-list?18d');
    };
    MEDOapi.addItem = function(title) {
      var newItem = {
        _links: {
          type: {
            href: urlBase + "/rest/type/node/todo"
          }
        },
        title: {
          value: title
        }
      };
      var configs = {
        headers: {
          "Content-Type": "application/hal+json"
        }
      }
      return $http.post(urlBase + '/entity/node', newItem, configs);
    };
    MEDOapi.removeItem = function(nid) {
      return $http.delete(urlBase + '/node/' + nid);
    };

    return MEDOapi;
  }])

}());
