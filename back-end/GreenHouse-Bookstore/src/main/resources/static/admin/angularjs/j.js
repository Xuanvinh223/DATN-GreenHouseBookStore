app.controller("SuppliersController", SuppliersController);


function SuppliersController($scope, $location, $routeParams, $http) {
    let host = "http://localhost:8081/rest";
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản Lý nhà cung cấp');
    });

    $scope.editingPublisher = {};
    $scope.isEditing = false;
    $scope.suppliers = [];

    $scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang

    // Load danh sách nhà xuất bản
    $scope.loadSuppliers = function () {
        var url = `${host}/suppliers`;
        $http.get(url)
            .then(function (resp) {
                $scope.suppliers = resp.data;

                $scope.totalItems = $scope.suppliers.length;

                $scope.data = resp.data;

                // Số mục trên mỗi trang
                $scope.itemsPerPage = 5;
                // Tính toán tổng số mục
                $scope.totalItems = $scope.data.length;
                // Trang hiện tại
                $scope.currentPage = 1;

                // Tính toán số trang
                $scope.pageCount = Math.ceil($scope.data.length / $scope.itemsPerPage);

                // Cập nhật danh sách mục trang hiện tại khi trang thay đổi
                $scope.$watch('currentPage + selectedItemsPerPage', function () {
                    var begin = ($scope.currentPage - 1) * $scope.selectedItemsPerPage;
                    var end = begin + $scope.selectedItemsPerPage;
                    $scope.suppliers = $scope.data.slice(begin, end);
                });

                $scope.showLastDots = true; // Biến trạng thái để kiểm soát hiển thị dấu chấm "..." hoặc nút "Last"

                $scope.firstPage = function () {
                    if ($scope.currentPage > 1) {
                        $scope.currentPage = 1;
                        $scope.showLastDots = true;
                        updateVisiblePages();
                    }
                };

                $scope.prevPage = function () {
                    if ($scope.currentPage > 1) {
                        $scope.currentPage--;
                        $scope.showLastDots = true;
                        updateVisiblePages();
                    }
                };

                $scope.nextPage = function () {
                    if ($scope.currentPage < $scope.pageCount) {
                        $scope.currentPage++;
                        $scope.showLastDots = true;
                        updateVisiblePages();
                    }
                };

                $scope.lastPage = function () {
                    if ($scope.currentPage < $scope.pageCount) {
                        $scope.currentPage = $scope.pageCount;
                        $scope.showLastDots = false;
                        updateVisiblePages();
                    }
                };

                // Đặt trang hiện tại
                $scope.setPage = function (page) {
                    $scope.currentPage = page;
                    updateVisiblePages();
                };

                // Cập nhật danh sách trang hiển thị
                function updateVisiblePages() {
                    var totalPages = $scope.pageCount;
                    var currentPage = $scope.currentPage;
                    var visiblePageCount = 3; // Số trang bạn muốn hiển thị
                    var startPage, endPage;

                    if (totalPages <= visiblePageCount) {
                        startPage = 1;
                        endPage = totalPages;
                    } else {
                        if (currentPage <= Math.ceil(visiblePageCount / 2)) {
                            startPage = 1;
                            endPage = visiblePageCount;
                        } else if (currentPage + Math.floor(visiblePageCount / 2) > totalPages) {
                            startPage = totalPages - visiblePageCount + 1;
                            endPage = totalPages;
                        } else {
                            startPage = currentPage - Math.floor(visiblePageCount / 2);
                            endPage = currentPage + Math.floor(visiblePageCount / 2);
                        }
                    }

                    $scope.visiblePages = [];
                    for (var i = startPage; i <= endPage; i++) {
                        $scope.visiblePages.push(i);
                    }
                }

                // Ban đầu, cập nhật danh sách trang hiển thị
                updateVisiblePages();

                $scope.onItemsPerPageChange = function () {
                    // Cập nhật số lượng phần tử trên mỗi trang
                    $scope.itemsPerPage = $scope.selectedItemsPerPage;
                    // Tính toán lại số trang dựa trên số lượng phần tử mới
                    $scope.pageCount = Math.ceil($scope.data.length / $scope.itemsPerPage);
                    // Đặt lại trang hiện tại về 1
                    $scope.currentPage = 1;
                    // Cập nhật danh sách trang hiển thị
                    updateVisiblePages();

                };
                console.log("Success", resp)
            }).catch(error => {
                console.log("Error", error);
            });
    }

    // Lưu thông tin nhà xuất bản
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

    // Chỉnh sửa thông tin nhà xuất bản và chuyển hướng
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

    // Xóa nhà xuất bản
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

    // Xóa ảnh đại diện và làm mới form
    $scope.clearImage = function () {
        $scope.editingSupplier.image = ""; // Xóa đường dẫn ảnh đại diện
        var imageElement = document.getElementById("uploadedImage");
        imageElement.src = ""; // Xóa hiển thị ảnh đại diện
        var fileInput = document.getElementById("fileInput");
        fileInput.value = null; // Đặt giá trị của input file thành null để xóa tệp đã chọn
    };

    // Làm mới form
    $scope.resetForm = function () {
        $scope.editingSupplier = {};
        $scope.isEditing = false;
        $scope.clearImage(); // Xóa ảnh đại diện khi làm mới form
    };

    $scope.loadSuppliers();
}
