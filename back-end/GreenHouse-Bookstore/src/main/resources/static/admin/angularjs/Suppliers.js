app.controller("SuppliersController", SuppliersController);


function SuppliersController($scope, $location, $routeParams, $http) {
    let host = "http://localhost:8081/rest/suppliers";
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản Lý nhà cung cấp');
    });

    $scope.editingSupplier = {};
    $scope.isEditing = false;
    $scope.suppliers = [];

    $scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang

    // Load danh sách nhà cung cấp
    $scope.loadSuppliers = function () {
        var url = `${host}`;
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

    // Lưu thông tin nhà cung cấp
    $scope.saveSupplier = function (supplierId) {
        $scope.errorMessages = {
            supplierId: '',
            supplierName: '',
            address: '',
            email: '',
            phone: ''
        };
        var formData = new FormData();
        var fileInput = document.getElementById("fileInput");
        if (fileInput && fileInput.files.length > 0) {
            formData.append("image", fileInput.files[0]);
        }
        var supplierId = $scope.editingSupplier.supplierId;
        var supplierName = $scope.editingSupplier.supplierName;
        var address = $scope.editingSupplier.address;
        var email = $scope.editingSupplier.email;
        var phone = $scope.editingSupplier.phone;

        // Kiểm tra bỏ trống mã nxb
        if (!supplierId) {
            $scope.errorMessages.supplierId = 'Vui lòng nhập mã nhà cung cấp';
            return;
        }
        // Kiểm tra bỏ trống tên nxb
        if (!supplierName) {
            $scope.errorMessages.supplierName = 'Vui lòng nhập tên nhà cung cấp';
            return;
        }
        // Kiểm tra bỏ trống nxb
        if (!address) {
            $scope.errorMessages.address = 'Vui lòng nhập địa chỉ nhà cung cấp';
            return;
        }
        // Kiểm tra bỏ trống nxb
        if (!email) {
            $scope.errorMessages.email = 'Vui lòng nhập email nhà cung cấp';
            return;
        }
        // Kiểm tra bỏ trống nxb
        if (!phone) {
            $scope.errorMessages.phone = 'Vui lòng nhập số điện thoại nhà cung cấp';
            return;
        }

        // Kiểm tra định dạng mã
        var supllierIdRegex = /^[A-Z0-9]{4,}$/;
        if (!supllierIdRegex.test(supplierId)) {
            $scope.errorMessages.supplierId = 'Mã nhà cung cấp phải chứa ít nhất 4 ký tự và chỉ được điền kí tự HOA và số';
            return;
        }

        // Kiểm tra trùng lặp supplierId trước khi thêm
        if (!$scope.isEditing) {
            var existingSupplier = $scope.suppliers.find(function (supplier) {
                return supplier.supplierId === $scope.editingSupplier.supplierId;
            });

            if (existingSupplier) {
                // Gán thông báo lỗi vào $scope.errorMessages.supplierId
                $scope.errorMessages.supplierId = `Mã Nhà cung cấp "${$scope.editingSupplier.supplierId}" đã tồn tại. Vui lòng chọn mã khác.`;
                return; // Không tiếp tục lưu nếu có lỗi
            }
        }

        // Kiểm tra trùng lặp supplierName trước khi thêm
        var existingSupplierName = $scope.suppliers.find(function (supplier) {
            return (
                supplier.supplierName === $scope.editingSupplier.supplierName &&
                supplier.supplierId !== $scope.editingSupplier.supplierId
            );
        });
        if (existingSupplierName) {
            // Hiển thị thông báo lỗi nếu tên nhà cung cấp đã tồn tại
            $scope.errorMessages.supplierName = `Tên Nhà cung cấp "${$scope.editingSupplier.supplierName}" đã tồn tại. Vui lòng chọn tên khác.`;
            return; // Không tiếp tục lưu nếu có lỗi
        }

        // Kiểm tra định dạng email Gmail
        function isGmail(email) {
            var emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            return emailRegex.test(email);
        }
        if (!isGmail($scope.editingSupplier.email)) {
            // Hiển thị thông báo lỗi nếu email không đúng định dạng Gmail
            $scope.errorMessages.email = `Email "${$scope.editingSupplier.email}" không đúng định dạng Gmail. Vui lòng kiểm tra lại.`;
            return; // Không tiếp tục lưu nếu có lỗi
        }
        // Kiểm tra trùng lặp email trước khi thêm
        var existingEmail = $scope.suppliers.find(function (supplier) {
            return (
                supplier.email === $scope.editingSupplier.email &&
                supplier.supplierId !== $scope.editingSupplier.supplierId
            );
        });
        if (existingEmail) {
            // Hiển thị thông báo lỗi nếu email đã tồn tại
            $scope.errorMessages.email = `Email "${$scope.editingSupplier.email}" đã tồn tại. Vui lòng chọn email khác.`;
            return; // Không tiếp tục lưu nếu có lỗi
        }

        //kiểm tra định dạng sđt
        function isPhoneNumber(phone) {
            var phoneNumberRegex = /^(032|033|034|035|036|037|038|039|081|082|083|084|085|070|079|077|076|078|056|058)\d{7}$|^(0282|0242|0286|0246|0283|0243|0244|0245|0246|0247|0248|0287|0247|0289|0249)\d{6}$/;
            return phoneNumberRegex.test(phone);
        }

        if (!isPhoneNumber($scope.editingSupplier.phone)) {
            // Hiển thị thông báo lỗi nếu số điện thoại không đúng định dạng
            $scope.errorMessages.phone = `Số điện thoại "${$scope.editingSupplier.phone}" không đúng định dạng đầu số Việt Nam. Vui lòng kiểm tra lại.`;
            return; // Không tiếp tục lưu nếu có lỗi
        }

        // Kiểm tra trùng lặp số điện thoại trước khi thêm
        var existingPhoneNumber = $scope.suppliers.find(function (supplier) {
            return (
                supplier.phone === $scope.editingSupplier.phone &&
                supplier.supplierId !== $scope.editingSupplier.supplierId
            );
        });

        if (existingPhoneNumber) {
            // Hiển thị thông báo lỗi nếu số điện thoại đã tồn tại
            $scope.errorMessages.phone = `Số điện thoại "${$scope.editingSupplier.phone}" đã tồn tại. Vui lòng chọn số điện thoại khác.`;
            return; // Không tiếp tục lưu nếu có lỗi
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
            // Sử dụng hộp thoại xác nhận từ thư viện Swal
            Swal.fire({
                title: 'Xác nhận cập nhật',
                text: `Bạn có muốn cập nhật nhà cung cấp "${$scope.editingSupplier.supplierId}" không?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Cập nhật',
                cancelButtonText: 'Hủy',
            }).then((result) => {
                if (result.isConfirmed) {
                    var url = `${host}/${$scope.editingSupplier.supplierId}`;
                    $http
                        .put(url, formData, {
                            transformRequest: angular.identity,
                            headers: {"Content-Type": undefined},
                        })
                        .then((resp) => {
                            $scope.loadSuppliers();
                            $scope.resetForm();
                            Swal.fire({
                                icon: "success",
                                title: "Thành công",
                                text: `Cập nhật nhà cung cấp "${$scope.editingSupplier.supplierId}" thành công`,
                            });
                            $scope.clearImage(); // Xóa ảnh đại diện sau khi cập nhật
                        })
                        .catch((error) => {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Cập nhật nhà cung cấp "${$scope.editingSupplier.supplierId}" thất bại`,
                            });
                        });
                } else {
                    // Nếu người dùng chọn "Hủy", bạn có thể thực hiện các hành động tùy ý hoặc không thực hiện gì cả.
                    // Ví dụ: không thực hiện cập nhật và trở lại biểu mẫu.
                }
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
                        text: `Thêm nhà cung cấp "${supplierId}" thành công `,
                    });
                    $scope.clearImage(); // Xóa ảnh đại diện sau khi thêm
                })
                .catch((error) => {
                    console.log(error.data);
                    if (error.data) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Thêm nhà cung cấp "${supplierId}" thất bại`,
                        });
                    }
                });
        }
    };

    // Chỉnh sửa thông tin nhà cung cấp và chuyển hướng
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

    // Xóa nhà cung cấp
    $scope.deleteSupplier = function (supplierId) {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có muốn xóa nhà cung cấp "${supplierId}" không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                var url = `${host}/${supplierId}`;
                $http
                    .delete(url)
                    .then((resp) => {
                        $scope.loadSuppliers();
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: `Xóa nhà cung cấp "${supplierId}" thành công`,
                        });
                    })
                    .catch((error) => {
                        if (error.status === 409) {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Nhà cung cấp mã "${supplierId}" đang được sử dụng và không thể xóa.`,
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Xóa nhà cung cấp "${supplierId}" thất bại`,
                            });
                        }
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
