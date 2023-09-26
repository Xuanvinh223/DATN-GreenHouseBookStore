app.controller('AccountController', AccountController);

function AccountController($scope, $http) {
    $scope.accounts = [];
    $scope.newAccount = {};
    $scope.editingAccount = null;
    $scope.isEditing = false;

    // Hàm để lấy danh sách thuongw hieu
    $scope.getAccount = function () {
        $http
            .get("/rest/account")
            .then(function (response) {
                $scope.accounts = response.data;
            })
            .catch(function (error) {
                console.error("Lỗi khi lấy danh sách tài khoản:", error);
            });
    };

    // Hàm để sao chép thông tin thuong hieu vào biến editingBrand và bật chế độ chỉnh sửa
    $scope.editAccount = function (accounts) {
        $scope.editingAccount = angular.copy(accounts);
        $scope.isEditing = true;
    };

    // Hàm để lưu thuongw hieu (thêm mới hoặc cập nhật)
    $scope.saveAccount = function () {
        if ($scope.editingAccount) {
            // Nếu đang chỉnh sửa, gọi hàm cập nhật thương hiệu ở đây
            $http
                .put("/api/account/" + $scope.editingAccount.username, $scope.editingAccount)
                .then(function () {
                    // Sau khi cập nhật thành công, làm mới danh sách thương hiệu và đặt lại form
                    $scope.getAccount();
                    $scope.resetForm();
                })
                .catch(function (error) {
                    console.error("Lỗi khi cập nhật tài khoản:", error);
                });
        } else {
            // Nếu thêm mới, gọi hàm thêm tác giả mới ở đây
            $http
                .post("/api/account", $scope.newAccount)
                .then(function () {
                    // Sau khi thêm thành công, làm mới danh sách tác giả và đặt lại form
                    $scope.getAccount();
                    $scope.resetForm();
                })
                .catch(function (error) {
                    console.error("Lỗi khi thêm tài khoản:", error);
                });
        }
    };

    // Hàm để hủy bỏ chế độ chỉnh sửa và đặt lại form
    $scope.cancelEdit = function () {
        $scope.isEditing = false;
        $scope.editingAccount = null;
    };

    // Hàm để đặt lại form
    $scope.resetForm = function () {
        $scope.isEditing = false;
        $scope.editingAccount = null;
        $scope.newAccount = {};
    };

    $scope.getAccount();
}
