
describe('HomeCtrl', function(){
  var $controller, $scope = {};
  // Make sure that you load all dependencies in a correct order
  beforeEach(module('tradeshiftApp'), module('pascalprecht.translate'));
  // Injecting ngMock service
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  it('checks controller', function(){
    var controller = $controller('HomeCtrl', { $scope: $scope });
    expect(controller).not.toBe(undefined);
  });
  it('checks $scope.showTab', function(){
    expect($scope.showTab).toBe(1);
  });
  it('checks $scope.getArray()', function(){
    var arrayOfObjects = [{key1: 'value1'}, {key2: 'value2'}];
    // Using lodash here to test if arrays are equal
    expect(_.isEqual($scope.getArray(arrayOfObjects), [['value1'], ['value2']])).toBe(true);
  })
});
