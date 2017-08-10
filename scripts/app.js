(function() {
  var app = angular.module('medo', []);

  app.controller('MEDOCtrl', ['$scope', '$http', '$timeout', 'MEDOapi', function($scope, $http, $timeout, MEDOapi){

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
      MEDOapi.addItem(item)
        .then(function(response) {
          var newItem = {
            'nid' : response.data.nid[0].value,
            'title' : item,
            'field_status' : '0'
          };
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
      MEDOapi.updateItem($scope.items[index].nid, item)
        .then(function(response) {
          // $scope.refreshList();
          $scope.showMsg($scope.items[index].title + ' has been updated.');
        },function(error){
          $scope.showMsg('There was an error updating the item');
          $scope.items[index].title = $scope.editVal;
        });
    };
    this.updateCancel = function(index) {
      $scope.items[index].title = $scope.editVal;
    };

    this.statusUpdate = function(event, index) {
      var checkedVal = event.target.checked;
      MEDOapi.statusUpdate($scope.items[index].nid, checkedVal)
        .then(function(response) {
          // $scope.refreshList();
          var status = checkedVal ? 'resolved' : 'opened';
          $scope.showMsg($scope.items[index].title + ' has been ' + status + '.');
        },function(error){
          $scope.showMsg('There was an error updating the item');
          $scope.items[index].field_status = checkedVal ? '0' : '1';
        });
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
    MEDOapi.updateItem = function(nid, title) {
      var item = {
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
      return $http.patch(urlBase + '/node/' + nid + '?_format=hal_json', item, configs);
    };
    MEDOapi.removeItem = function(nid) {
      return $http.delete(urlBase + '/node/' + nid);
    };

    MEDOapi.statusUpdate = function(nid, status) {
      var item = {
        _links: {
          type: {
            href: urlBase + "/rest/type/node/todo"
          }
        },
        field_status: {
          value: status
        }
      };
      var configs = {
        headers: {
          "Content-Type": "application/hal+json"
        }
      }
      return $http.patch(urlBase + '/node/' + nid + '?_format=hal_json', item, configs);
    };

    return MEDOapi;
  }])

}());
