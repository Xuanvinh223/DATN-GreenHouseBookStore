app.controller("DiscountController", function ($scope, $location, $routeParams, $http, $filter) {
    $scope.page.setTitle("Quản Lý Giảm Giá");

    let host = "http://localhost:8081/rest/discounts";
    $scope.editingDiscount = {};
    $scope.isEditing = false;
    $scope.discounts = [];
    $scope.filteredDiscounts = [];
    $scope.errors = "";
    $scope.searchText = "";
    $scope.noResults = false;
    $scope.orderByField = "";
    $scope.reverseSort = true;
    $scope.itemsPerPageOptions = [5, 10, 20, 50];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 1;


    $scope.checkErrors = function () {
        $scope.errors = {};

        if (!$scope.editingDiscount.startDate) {
            $scope.errors.startDate = 'Vui lòng chọn ngày bắt đầu.';
        }

        if (!$scope.editingDiscount.endDate) {
            $scope.errors.endDate = 'Vui lòng chọn ngày kết thúc.';
        }


        if (!$scope.editingDiscount.value || $scope.editingDiscount.value < 1) {
            $scope.errors.value = 'Giá trị phải lớn hơn hoặc bằng 1.';
        }

        if (!$scope.editingDiscount.quantity || $scope.editingDiscount.quantity < 1 || $scope.editingDiscount.quantity > 100) {
            $scope.errors.quantity = 'Tổng số lượng phải nằm trong khoảng từ 1 đến 100.';
        }

        if ($scope.editingDiscount.startDate && $scope.editingDiscount.endDate) {
            var start = new Date($scope.editingDiscount.startDate);
            var end = new Date($scope.editingDiscount.endDate);
            if (start >= end) {
                $scope.errors.startDate = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.';
                $scope.errors.endDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu.';
            }
        }

        var hasErrors = Object.keys($scope.errors).length > 0;

        return !hasErrors;
    };


    $scope.loadDiscounts = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.discounts = resp.data;
                $scope.searchData();
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    $scope.searchData = function () {
        $scope.filteredDiscounts = $filter("filter")(
            $scope.discounts,
            $scope.searchText
        );
        $scope.noResults = $scope.filteredDiscounts.length === 0;
    };

    $scope.sortBy = function (field) {
        if ($scope.orderByField === field) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.orderByField = field;
            $scope.reverseSort = true;
        }
    };

    $scope.calculateRange = function () {
        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        var end = Math.min(
            start + $scope.itemsPerPage,
            $scope.filteredDiscounts.length
        );
        return start + 1 + "-" + end + " of " + $scope.filteredDiscounts.length;
    };

    function generateDiscountId() {
        const prefix = "210";
        const randomNumbers = Math.floor(Math.random() * 1000);
        return prefix + String(randomNumbers).padStart(3, "0");
    }

    $scope.saveDiscount = function () {
        if (!$scope.editingDiscount.discountId) {
            $scope.editingDiscount.discountId = generateDiscountId();
        }
        if (!$scope.checkErrors()) {
            return;
        }

        var discount = {
            discountId: $scope.editingDiscount.discountId,
            value: $scope.editingDiscount.value || 0,
            startDate: $scope.editingDiscount.startDate || null,
            endDate: $scope.editingDiscount.endDate || null,
            quantity: $scope.editingDiscount.quantity || 0,
            usedQuantity: $scope.editingDiscount.usedQuantity || 0,
            active: $scope.editingDiscount.active = false,
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
                .catch((error) => {
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
                .catch((error) => {
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
                $scope.editingDiscount = angular.copy(resp.data);
                $scope.editingDiscount.startDate = new Date($scope.editingDiscount.startDate);
                $scope.editingDiscount.endDate = new Date($scope.editingDiscount.endDate);
                $scope.editingDiscount.active = String($scope.editingDiscount.active);
                $scope.isEditing = true;

                $location.path("/discount-form").search({id: discountId, data: angular.toJson(resp.data)});
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    if ($routeParams.data) {
        $scope.editingDiscount = angular.fromJson($routeParams.data);
        $scope.editingDiscount.startDate = new Date($scope.editingDiscount.startDate);
        $scope.editingDiscount.endDate = new Date($scope.editingDiscount.endDate);
        $scope.editingDiscount.active = String($scope.editingDiscount.active);
        $scope.isEditing = true;
    }

    $scope.deleteDiscount = function (discountId) {
        Swal.fire({
            title: "Xóa Giảm Giá?",
            text: "Bạn có chắc chắn muốn xóa giảm giá này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có",
            cancelButtonText: "Không",
        }).then((result) => {
            if (result.isConfirmed) {
                var url = `${host}/${discountId}`;
                $http
                    .delete(url)
                    .then(function (resp) {
                        if (resp.status === 200) {
                            $scope.loadDiscounts();
                            Swal.fire({
                                icon: "success",
                                title: "Thành công",
                                text: `Xóa giảm giá ${discountId} thành công`,
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Không thể xóa giảm giá ${discountId} vì có khóa ngoại với các dữ liệu khác.`,
                            });
                        }
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Xóa giảm giá ${discountId} thất bại`,
                        });
                    });
            }
        });
    };


    $scope.resetForm = function () {
        $scope.editingDiscount = {};
        $scope.isEditing = false;
    };

    $scope.loadDiscounts();
});
