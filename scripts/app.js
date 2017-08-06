(function() {
  var app = angular.module('medo', []);

  var medo_items = [
    {
      'text': 'Eat'
    },
    {
      'text': 'Sleep'
    },
    {
      'text': 'Cry'
    }
  ];

  app.controller('MEDOCtrl', function($scope){
    this.items = medo_items;
    this.addNew = function(item) {
      var newItem = {'text' : item};
      this.items.push(newItem);
      this.newitem = '';
    };
    this.removeItem = function(index) {
      this.items.splice(index, 1);
    };
    this.editItem = function(index) {
      this.editVal = this.items[index].text;

    };
    this.updateSave = function(index, item) {
    };
    this.updateCancel = function(index) {
      this.items[index].text = this.editVal;
    };
  });

}());
