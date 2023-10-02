app.controller("DiscountController", function ($scope, $location, $routeParams, $http) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản Lý Giảm Giá');
    });
    let host = "http://localhost:8081/rest/discounts";
    $scope.editingDiscount = {};
    $scope.isEditing = false;

    $scope.discounts = [];

    // Hàm tạo mã giảm giá mới
    function generateDiscountId() {
        const prefix = "210"; // 3 ký tự đầu
        const randomNumbers = Math.floor(Math.random() * 1000); // 3 số ngẫu nhiên
        return prefix + String(randomNumbers).padStart(3, "0"); // Kết hợp và định dạng lại
    }

    $scope.loadDiscounts = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.discounts = resp.data;
            })
            .catch((Error) => {
                console.log("Error", Error);
            });
    };


    $scope.saveDiscount = function () {
        // Nếu không có mã giảm giá, tạo mã mới
        if (!$scope.editingDiscount.discountId) {
            $scope.editingDiscount.discountId = generateDiscountId();
        }

        var discount = {
            discountId: $scope.editingDiscount.discountId,
            value: $scope.editingDiscount.value || 0,
            startDate: $scope.editingDiscount.startDate || null,
            endDate: $scope.editingDiscount.endDate || null,
            quantity: $scope.editingDiscount.quantity || 0,
            usedQuantity: $scope.editingDiscount.usedQuantity || 0,
            active: $scope.editingDiscount.active || false,
        };

        if ($scope.isEditing) {
            var url = `${host}/${discount.discountId}`;
            $http
                .put(url, discount)
                .then((resp) => {
                    $scope.loadDiscounts();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Cập nhật giảm giá ${discount.discountId}`,
                    });
                })
                .catch((Error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Cập nhật giảm giá ${discount.discountId} thất bại`,
                    });
                });
        } else {
            var url = `${host}`;
            $http
                .post(url, discount)
                .then((resp) => {
                    $scope.loadDiscounts();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Thêm giảm giá ${discount.discountId}`,
                    });
                })
                .catch((Error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Thêm giảm giá thất bại`,
                    });
                });
        }
    };

    $scope.editDiscountAndRedirect = function (discountId) {
        var url = `${host}/${discountId}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.editingDiscount = resp.data;
                $scope.editingDiscount.startDate = new Date($scope.editingDiscount.startDate); // Chuyển đổi thành kiểu ngày
                $scope.editingDiscount.endDate = new Date($scope.editingDiscount.endDate); // Chuyển đổi thành kiểu ngày
                $scope.editingDiscount.active = String($scope.editingDiscount.active); // Chuyển trạng thái thành kiểu chuỗi
                $scope.isEditing = true;

                $location.path("/discount-form").search({id: discountId, data: angular.toJson(resp.data)});
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    if ($routeParams.data) {
        $scope.editingDiscount = angular.fromJson($routeParams.data);
        $scope.editingDiscount.startDate = new Date($scope.editingDiscount.startDate); // Chuyển đổi thành kiểu ngày
        $scope.editingDiscount.endDate = new Date($scope.editingDiscount.endDate); // Chuyển đổi thành kiểu ngày
        $scope.editingDiscount.active = String($scope.editingDiscount.active); // Chuyển trạng thái thành kiểu chuỗi
        $scope.isEditing = true;
    }

    $scope.deleteDiscount = function (discountId) {
        var url = `${host}/${discountId}`;

        $http
            .delete(url)
            .then((resp) => {
                $scope.loadDiscounts();
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: `Xóa giảm giá ${discountId} thành công`,
                });
            })
            .catch((Error) => {
                Swal.fire({
                    icon: "error",
                    title: "Thất bại",
                    text: `Xóa giảm giá ${discountId} thất bại`,
                });
            });
    };

    $scope.resetForm = function () {
        $scope.editingDiscount = {};
        $scope.isEditing = false;
    };

    $scope.loadDiscounts();
});
