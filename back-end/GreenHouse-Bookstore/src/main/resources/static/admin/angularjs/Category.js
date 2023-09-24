app.controller("CategoryController", function ($scope, $location, $routeParams, $http) {
    let host = "http://localhost:8081/rest/categories";
    $scope.editingCategory = {};
    $scope.isEditing = false;

    $scope.categories = [];
    $scope.categoryTypes = [];


    $scope.loadCategories = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.categories = resp.data;
            })
            .catch((Error) => {
                console.log("Error", Error);
            });
    };
    // Lấy dữ liệu loại danh mục
    $http
        .get("/rest/categoryTypes")
        .then((resp) => {
            $scope.categoryTypes = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });


    $scope.saveCategory = function () {
        // Tạo một id mới với kí tự "CAT" và 3 kí tự ngẫu nhiên
        if (!$scope.isEditing) {
            $scope.editingCategory.categoryId = "CAT00" + generateRandomId(3);
        }

        var category = {
            categoryId: $scope.editingCategory.categoryId,
            categoryName: $scope.editingCategory.categoryName || "",
            typeId: $scope.editingCategory.typeId || "",
        };

        if ($scope.isEditing) {
            var url = `${host}/${category.categoryId}`;
            $http
                .put(url, category)
                .then((resp) => {
                    $scope.loadCategories();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Cập nhật danh mục ${category.categoryId}`,
                    });
                })
                .catch((Error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Cập nhật danh mục ${category.categoryId} thất bại`,
                    });
                });
        } else {
            var url = `${host}`;
            $http
                .post(url, category)
                .then((resp) => {
                    $scope.loadCategories();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Thêm danh mục ` + category.categoryName,
                    });
                })
                .catch((Error) => {
                    console.log(Error.data);
                    if (Error.data) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Thêm danh mục thất bại`,
                        });
                    }
                });
        }
    };

    // Hàm tạo mã ngẫu nhiên với 3 ký tự số
    function generateRandomId() {
        let result = "";
        for (let i = 0; i < 3; i++) {
            result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
        }
        return result;
    }

    $scope.editCategoryAndRedirect = function (categoryId) {
        var url = `${host}/${categoryId}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.editingCategory = angular.copy(resp.data);
                $scope.isEditing = true;

                // Chuyển hướng đến trang chỉnh sửa thông tin danh mục và truyền dữ liệu danh mục.
                // Sử dụng $location.search để thiết lập tham số trong URL.
                $location.path("/category-form").search({ id: categoryId, data: angular.toJson(resp.data) });
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào editingCategory.
        $scope.editingCategory = angular.fromJson($routeParams.data);
        $scope.isEditing = true;
    }

    $scope.deleteCategory = function (categoryId) {
        var url = `${host}/${categoryId}`;

        $http
            .delete(url)
            .then((resp) => {
                $scope.loadCategories();
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: `Xóa danh mục ${categoryId} thành công`,
                });
            })
            .catch((Error) => {
                if (Error.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Danh mục ${categoryId} đang được sử dụng và không thể xóa.`,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Xóa danh mục ${categoryId} thất bại`,
                    });
                }
            });
    };

    $scope.resetForm = function () {
        $scope.editingCategory = {};
        $scope.isEditing = false;
    };

    $scope.loadCategories();
});
