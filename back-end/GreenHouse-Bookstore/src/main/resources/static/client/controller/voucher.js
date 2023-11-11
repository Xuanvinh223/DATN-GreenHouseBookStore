app.controller("voucherController", voucherController);

function voucherController($http, $scope, voucherAPI) {
    var host = voucherAPI;
    $scope.listVoucher = [];
    $scope.getVoucherData = function () {
        $http
            .get(host + "/list-vouchers")
            .then(function (response) {
                $scope.listVoucher = response.data;
            })
            .catch(function (error) {
                // Xử lý lỗi nếu có
                console.error("Error:", error);
            });
    };

    $scope.Create = function (voucher) {
        var username = localStorage.getItem("username");
        var data = {
            username: username,
            voucher: voucher,
        };
        $http
            .post(host + "/add/voucher", JSON.stringify(data))
            .then(function (response) {
                // Xử lý dữ liệu khi request thành công
                var message = response.data.message;
                var status = response.data.status;
                if (status == 200) {
                    $scope.showNotification("success", message);
                } else {
                    $scope.showNotification("error", message);
                }
            })
            .catch(function (error) {
                // Xử lý lỗi khi request thất bại
                console.error(error);
            });
    };

    $scope.getVoucherData();
}
