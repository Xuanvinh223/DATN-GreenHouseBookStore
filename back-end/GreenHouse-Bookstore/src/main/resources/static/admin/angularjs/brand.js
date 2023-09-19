app.controller('brandController', brandController);

function brandController($scope) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản Lý Thương Hiệu');
    });
    // ... Các mã xử lý khác trong controller
  
}