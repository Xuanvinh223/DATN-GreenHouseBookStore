app.controller('IndexController', IndexController);

function IndexController($scope, $http) { 
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Trang quản trị');
    });
    let host = "http://localhost:8081/rest";
    $scope.getIndexCount = function () {
        var url = `${host}/getIndexCount`;
        $http.get(url).then(resp => {
            $scope.countOrdersWithStatus = resp.data.countOrdersWithStatus;
            $scope.countByBrand = resp.data.countByBrand;
            $scope.countByCustomer = resp.data.countByCustomer;
            // console.log(  $scope.countOrdersWithStatus);
        }).catch(error => {
            console.log("Error", error);
        });
    }
    $scope.getIndexCount();
}