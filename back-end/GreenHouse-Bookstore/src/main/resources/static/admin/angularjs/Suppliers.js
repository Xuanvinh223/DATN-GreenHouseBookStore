app.controller('SuppliersController', SuppliersController);

function SuppliersController($scope, $http) {
    $scope.suppliers = [];
    // $scope.newAuthor = {};
    // $scope.editingAuthor = null;
    // $scope.isEditing = false;

    // Hàm để lấy danh sách nxb
    $scope.getSuppliers = function () {
        $http
            .get("/api/suppliers")
            .then(function (response) {
                $scope.suppliers = response.data;
            })
            .catch(function (error) {
                console.error("Lỗi khi lấy danh sách tác giả:", error);
            });
    };

    $scope.getSuppliers();
}
