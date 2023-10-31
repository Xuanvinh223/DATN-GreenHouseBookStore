app.controller("BestSellerController", BestSellerController);

function BestSellerController($scope, $location, $routeParams, $http) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Sản phẩm bán chạy');
        $scope.loadBestSellers(); // Thay vì `loadPublishers`
    });

    $scope.isEditing = false;
    $scope.bestsellers = [];
    $scope.searchText = "";

    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    let host = "http://localhost:8081/rest/best-seller"; // Có thể cần chỉnh sửa URL tương ứng
    $scope.selectedItemsPerPage = 5;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.totalItems = $scope.bestsellers.length;
    $scope.maxSize = 5;
    $scope.reverseSort = false;

    $scope.getNumOfPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.calculateRange = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + 1;
        var endIndex = $scope.currentPage * $scope.itemsPerPage;

        if (endIndex > $scope.totalItems) {
            endIndex = $scope.totalItems;
        }

        return startIndex + ' đến ' + endIndex + ' trên tổng số ' + $scope.totalItems + ' mục';
    };

    $scope.loadBestSellers = function () {
        var url = `${host}`;
        $http.get(url).then(resp => {
            $scope.originalBestseller = $scope.bestsellers;
            $scope.bestsellers = resp.data;
            console.log("success", resp.data);
            $scope.totalItems = $scope.bestsellers.length;
        }).catch(error => {
            console.log("Error", error);
        });
    }

//   $scope.searchData = function () {
//     $scope.publishers = $scope.originalPublishers.filter(function (publisher) {
//       return (
//         publisher.publisherId.toString().includes($scope.searchText) || publisher.publisherName.toLowerCase().includes($scope.searchText.toLowerCase()) || publisher.email.toString().includes($scope.searchText)
//       );
//     });
//     $scope.totalItems = $scope.searchText ? $scope.publishers.length : $scope.originalPublishers.length;
//     $scope.setPage(1);
//   };


}
