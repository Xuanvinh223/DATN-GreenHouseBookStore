app.controller("ProductImageController", function ($scope, $location, $routeParams, $http) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản Lý Hình Ảnh Sản Phẩm');
    });

    let host = "http://localhost:8081/rest/productImages";
    $scope.editingProductImage = {};
    $scope.isEditing = false;

    $scope.productImages = [];

    $scope.loadProductImages = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.productImages = resp.data;
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    $scope.saveProductImage = function () {
        var formData = new FormData();

        // Thêm các ảnh vào formData
        for (var i = 0; i < $scope.selectedImages.length; i++) {
            formData.append("images", $scope.selectedImages[i].file);
        }

        // Thêm các thuộc tính của hình ảnh sản phẩm vào formData
        var productImage = {
            // Thêm các thuộc tính của hình ảnh sản phẩm vào đây
        };
        formData.append("productImageJson", JSON.stringify(productImage));

        if ($scope.isEditing) {
            var url = `${host}/${$scope.editingProductImage.id}`;
            $http
                .put(url, formData, {
                    transformRequest: angular.identity,
                    headers: {"Content-Type": undefined},
                })
                .then((resp) => {
                    $scope.loadProductImages();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Cập nhật hình ảnh sản phẩm ${$scope.editingProductImage.id} thành công`,
                    });
                    $scope.clearImages(); // Xóa hình ảnh sau khi cập nhật
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Cập nhật hình ảnh sản phẩm ${$scope.editingProductImage.id} thất bại`,
                    });
                });
        } else {
            var url = `${host}`;
            $http
                .post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined,
                    },
                })
                .then((resp) => {
                    $scope.loadProductImages();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Thêm nhiều ảnh sản phẩm thành công`,
                    });
                    $scope.clearImages(); // Xóa hình ảnh sau khi thêm
                })
                .catch((error) => {
                    if (error.data) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Thêm nhiều ảnh sản phẩm thất bại`,
                        });
                    }
                });
        }
    };

    $scope.editProductImageAndRedirect = function (id) {
        var url = `${host}/${id}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.editingProductImage = angular.copy(resp.data);
                $scope.isEditing = true;

                // Chuyển hướng đến trang chỉnh sửa thông tin hình ảnh sản phẩm và truyền dữ liệu hình ảnh.
                // Sử dụng $location.search để thiết lập tham số trong URL.
                $location
                    .path("/productImage-form")
                    .search({id: id, data: angular.toJson(resp.data)});
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào editingProductImage.
        $scope.editingProductImage = angular.fromJson($routeParams.data);
        $scope.isEditing = true;
    }

    $scope.deleteProductImage = function (id) {
        var url = `${host}/${id}`;

        $http
            .delete(url)
            .then((resp) => {
                $scope.loadProductImages();
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: `Xóa hình ảnh sản phẩm ${id} thành công`,
                });
            })
            .catch((error) => {
                if (error.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Hình ảnh sản phẩm mã ${id} đang được sử dụng và không thể xóa.`,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Xóa hình ảnh sản phẩm ${id} thất bại`,
                    });
                }
            });
    };

    // Thêm biến selectedImages để lưu trữ các ảnh đã chọn
    $scope.selectedImages = [];

    // Hàm xử lý khi người dùng chọn một hoặc nhiều ảnh
    $scope.onImageSelect = function (event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageUrl = URL.createObjectURL(file);
            $scope.$apply(function () {
                $scope.selectedImages.push({file: file, url: imageUrl});
            });
        }
    };

    // Hàm xử lý khi người dùng xóa một ảnh
    $scope.deleteImage = function (index) {
        // Loại bỏ ảnh khỏi mảng selectedImages
        $scope.selectedImages.splice(index, 1);
    };

    $scope.loadProductImages();
});
