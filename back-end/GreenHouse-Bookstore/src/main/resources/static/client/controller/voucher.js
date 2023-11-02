app.controller("voucherController", voucherController);

function voucherController($http, $scope, voucherAPI) {
    var host = voucherAPI;
    $scope.listVoucher = [];
    $scope.getVoucherData = function () {
        $http
            .get(host + "/list-vouchers")
            .then(function (response) {
                $scope.listVoucher = response.data;
                console.log($scope.listVoucher);
            })
            .catch(function (error) {
                // Xử lý lỗi nếu có
                console.error("Error:", error);
            });
    };

    $scope.getVoucherData();
}
