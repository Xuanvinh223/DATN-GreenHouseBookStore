app.controller('SuppliersController', function ($scope, $location, $routeParams, $http) {
    let host = "http://localhost:8081/rest/suppliers";
    $scope.editingSupplier = {};
    $scope.isEditing = false;

    $scope.suppliers = [];

    $scope.loadSuppliers = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.suppliers = resp.data;
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    $scope.saveSupplier = function (supplierId) {
        var formData = new FormData();
        var fileInput = document.getElementById("fileInput");

        if (fileInput && fileInput.files.length > 0) {
            formData.append("image", fileInput.files[0]);
        }

        formData.append(
            "supplierJson",
            JSON.stringify({
                supplierId: $scope.editingSupplier.supplierId || "",
                supplierName: $scope.editingSupplier.supplierName || "",
                description: $scope.editingSupplier.description || "",
                address: $scope.editingSupplier.address || "",
                email: $scope.editingSupplier.email || "",
                phone: $scope.editingSupplier.phone || "", // Thêm trường phone
                image: $scope.editingSupplier.image || "",
            })
        );

        if ($scope.isEditing) {
            var url = `${host}/${$scope.editingSupplier.supplierId}`;
            $http
                .put(url, formData, {
                    transformRequest: angular.identity,
                    headers: { "Content-Type": undefined },
                })
                .then((resp) => {
                    $scope.loadSuppliers();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Cập nhật nhà cung cấp ${supplierId}`,
                    });
                    $scope.clearImage(); // Xóa ảnh đại diện sau khi cập nhật
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Cập nhật nhà cung cấp ${supplierId} thất bại`,
                    });
                });
        } else {
            var url = `${host}`;
            $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined,
                },
            })
                .then((resp) => {
                    $scope.loadSuppliers();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Thêm nhà cung cấp ${supplierId} `,
                    });
                    $scope.clearImage(); // Xóa ảnh đại diện sau khi thêm
                })
                .catch((error) => {
                    console.log(error.data);
                    if (error.data) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Thêm nhà cung cấp ${supplierId} thất bại`,
                        });
                    }
                });
        }
    };

    $scope.editSupplierAndRedirect = function (supplierId) {
        var url = `${host}/${supplierId}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.editingSupplier = angular.copy(resp.data);
                $scope.isEditing = true;

                // Chuyển hướng đến trang chỉnh sửa thông tin nhà cung cấp và truyền dữ liệu nhà cung cấp.
                // Sử dụng $location.search để thiết lập tham số trong URL.
                $location
                    .path("/supplier-form")
                    .search({ id: supplierId, data: angular.toJson(resp.data) });
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào editingSupplier.
        $scope.editingSupplier = angular.fromJson($routeParams.data);
        $scope.isEditing = true;
    }

    $scope.deleteSupplier = function (supplierId) {
        var url = `${host}/${supplierId}`;

        $http
            .delete(url)
            .then((resp) => {
                $scope.loadSuppliers();
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: `Xóa nhà cung cấp ${supplierId} thành công`,
                });
            })
            .catch((error) => {
                if (error.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Nhà cung cấp mã ${key} đang được sử dụng và không thể xóa.`,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Xóa nhà cung cấp ${supplierId} thất bại`,
                    });
                }
            });
    };

    $scope.clearImage = function () {
        $scope.editingSupplier.image = ""; // Xóa đường dẫn ảnh đại diện
        var imageElement = document.getElementById("uploadedImage");
        imageElement.src = ""; // Xóa hiển thị ảnh đại diện
        var fileInput = document.getElementById("fileInput");
        fileInput.value = null; // Đặt giá trị của input file thành null để xóa tệp đã chọn
    };

    $scope.resetForm = function () {
        $scope.editingSupplier = {};
        $scope.isEditing = false;
        $scope.clearImage(); // Xóa ảnh đại diện khi làm mới form
    };

    $scope.loadSuppliers();
});
