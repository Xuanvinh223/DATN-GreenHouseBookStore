app.controller('indexClientController', indexClientController);

function indexClientController($scope, $http, $location) {
    // Khai báo một mảng để lưu trữ dữ liệu từ API
    $scope.sellingProducts = [];
    let host = "http://localhost:8081/rest";
    // Gửi yêu cầu GET đến máy chủ để lấy dữ liệu
    $scope.loadIndex = function () {
        var url = `${host}/getDataIndex`;
        $http.get(url)
            .then(function (response) {
                // Xử lý dữ liệu nhận được từ máy chủ
                $scope.sellingProducts = response.data.sellingProducts;
                console.log("Dữ Liệu SẢN PHẨM BÁN CHẠY: ", $scope.sellingProducts);
            })
            .catch(function (error) {
                // Xử lý lỗi nếu có
                console.error('Error fetching data: ' + error);
            });
    }
    $scope.loadIndex();
}
