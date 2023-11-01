app.controller(
    "VouchersController",
    function ($scope, $location, $routeParams, $http) {
        let host = "http://localhost:8081/rest/vouchers";

        $scope.edittingVoucher = {};
        $scope.isEditing = false;
        $scope.vouchers = [];
        $scope.selectedType = "";
        $scope.isSelectingProduct = true;
        $scope.modalTitle = "Chọn loại sản phẩm";

        $scope.searchKeyword = "";

    $scope.searchCategoryResults = [];
    $scope.selectedCategories = [];
    $scope.searchCategoryKeyword = null;
    $scope.listCategories = [];

    $scope.filteredProducts = [];

        $scope.listProduct = [];
        $scope.searchProductResults = [];
        $scope.selectedProducts = [];
        $scope.searchProductKeyword = null;
        $scope.listdeletedCategories = [];
    //thay đổi khi chọn sản phẩm và chọn loại sản phẩm khi vào nút
    $scope.toggleSelection = function () {
        $scope.isSelectingProduct = !$scope.isSelectingProduct;
        $scope.modalTitle = $scope.isSelectingProduct
            ? "Chọn sản phẩm"
            : "Chọn loại sản phẩm";
    };

    //Get bảng Category
    $scope.loadCategory = function () {
        var url = "http://localhost:8081/rest/categories";
        $http
            .get(url)
            .then((resp) => {
                $scope.listCategories = resp.data;
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    // SEARCH Category -- START
    $scope.searchCategory = function (keyword) {
        $scope.searchCategoryResults = [];
        if (keyword) {
            keyword = keyword.toLowerCase();
            $scope.searchCategoryResults = $scope.listCategories.filter(function (
                cate
            ) {
                return cate.categoryName.toLowerCase().includes(keyword);
            });
        } else {
            $scope.searchCategoryKeyword = null;
        }
    };
    $scope.loadCategory();

    //Select Category để hiển thị khi search trên modal
    $scope.selectedCategory = function (cate) {
        var existingCategory = $scope.selectedCategories.find(function (c) {
            return c.categoryId === cate.categoryId;
        });

        if (!existingCategory) {
            $scope.selectedCategories.push(cate);
        }

        // Gọi hàm tương ứng để cập nhật giao diện người dùng (nếu cần)
        $scope.searchCategory(null);
    };
        //Hàm Xóa Product_FlashSale Tạm
    $scope.removeCategory = function (index) {
        var removedCategory = $scope.selectedCategories[index];

        if (removedCategory) {
            removedCategory.deleted = true; // Đánh dấu danh mục đã bị xóa
            $scope.listdeletedCategories.push(removedCategory);
            $scope.selectedCategories.splice(index, 1); // Loại bỏ danh mục khỏi selectedCategories
            console.log("Đã xóa được", removedCategory);
        }
    };

    //-------------------------------------------------------------------------------
    //Get bảng Product
    $scope.loadProduct = function () {
        var url = "http://localhost:8081/rest/products";
        $http
            .get(url)
            .then((resp) => {
                $scope.listProduct = resp.data;
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    // SEARCH Product -- START
    $scope.searchProduct = function (keyword) {
        $scope.searchProductResults = [];
        if (keyword) {
            keyword = keyword.toLowerCase();
            $scope.searchProductResults = $scope.listProduct.filter(function (pro) {
                return pro.productName.toLowerCase().includes(keyword);
            });
        } else {
            $scope.searchProductKeyword = null;
        }
    };
        $scope.loadProduct();

        //Select Product để hiển thị khi search trên modal
        $scope.selectedProduct = function (pro) {
            var existingProduct = $scope.selectedProducts.find(function (p) {
                return p.productId === pro.productId;
            });

            if (!existingProduct) {
                $scope.selectedProducts.push(pro);
            }

            // Gọi hàm tương ứng để cập nhật giao diện người dùng (nếu cần)
            $scope.searchProduct(null);
        };

        //Get Vocher
    $scope.loadVouchers = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.vouchers = resp.data;
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    //Save and Update Voucher
    $scope.saveVoucher = function () {
        var data = {
            voucher: {
                voucherId: $scope.edittingVoucher.voucherId,
                voucherName: $scope.edittingVoucher.voucherName,
                code: $scope.edittingVoucher.code,
                voucherType: $scope.edittingVoucher.voucherType,
                discountType: $scope.edittingVoucher.discountType,
                discountAmount: $scope.edittingVoucher.discountAmount,
                discountPercentage: $scope.edittingVoucher.discountPercentage,
                minimumPurchaseAmount: $scope.edittingVoucher.minimumPurchaseAmount,
                maximumDiscountAmount: $scope.edittingVoucher.maximumDiscountAmount,
                startDate: $scope.edittingVoucher.startDate,
                endDate: $scope.edittingVoucher.endDate,
                totalQuantity: $scope.edittingVoucher.totalQuantity,
                usedQuantity: $scope.edittingVoucher.usedQuantity,
                status: $scope.edittingVoucher.status,
                description: $scope.edittingVoucher.description,
            },
            categories: $scope.selectedCategories,
            products: $scope.selectedProduct,
            listdeletedCategories: $scope.listdeletedCategories, // Thêm danh mục đã bị xóa vào data
        };
        console.log($scope.listdeletedCategories);
        $http
            .post(host, data)
            .then((resp) => {
                console.log("Thêm Voucher thành công", data);
                $scope.loadVouchers();
                $scope.resetForm();
                showSuccess(resp.data.message);
            })
            .catch(function (error) {
                console.log(error);
                var action = $scope.isEditing ? "Thêm" : "Cập nhật";
                showError(`${action} voucher thất bại`);
            });
    };

    //Edit Voucher và chuyển hướng
    $scope.editVoucherAndRedirect = function (voucherId) {
        var url = `${host}/${voucherId}`;
        $http
            .get(url)
            .then(function (resp) {
                $location.path("/voucher-form").search({
                    id: voucherId,
                    data: resp.data,
                });
                // .replace();
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };
    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào edittingVoucher.
        $scope.edittingVoucher = angular.fromJson($routeParams.data.vouchers);
        $scope.selectedCategories = angular.fromJson(
            $routeParams.data.categories
        );
        $scope.selectedProduct = angular.fromJson($routeParams.data.products);
        console.log($routeParams.data);
        $scope.isEditing = true;
    }

        //Chuyển đổi 3 button khi click radio
        $scope.$watch("edittingVoucher.voucherType", function (newVal, oldVal) {
            if (newVal === "Loại sản phẩm") {
                $scope.selectedType = "product";
            } else if (newVal === "Sản phẩm") {
                $scope.selectedType = "item";
            } else if (newVal === "Phí ship") {
                $scope.selectedType = "ship";
            } else {
                $scope.selectedType = "";
            }
        });

        //Chuyển đổi input Phần trăm và Giảm giá cố định khi click radio
        $scope.toggleDiscountType = function () {
            if ($scope.edittingVoucher.discountType === "Phần trăm") {
                $scope.edittingVoucher.discountAmount = null; // Reset giá trị số tiền giảm
            } else if ($scope.edittingVoucher.discountType === "Giảm giá cố định") {
                $scope.edittingVoucher.discountPercentage = null; // Reset giá trị phần trăm giảm
            }
        };

    //Search Modal
    $scope.search = function () {
        $http
            .get("http://your-api-url.com/products?search=" + $scope.searchKeyword)
            .then(function (response) {
                $scope.filteredProducts = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching product information:", error);
            });
    };

    $scope.selectProduct = function (product) {
        $scope.selectedProduct = product;
    };

    //DELETE VOUCHER
    $scope.deleteVoucher = function (voucherId) {
        var url = `${host}/${voucherId}`;
        Swal.fire({
            title: "Bạn chắc chắn?",
            text: "Dữ liệu sẽ bị xóa vĩnh viễn.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                // Sử dụng $http để gửi yêu cầu DELETE đến API
                $http
                    .delete(url)
                    .then((resp) => {
                        // Xóa voucher thành công, cập nhật danh sách
                        $scope.loadVouchers();
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: `Xóa Voucher ${voucherId} thành công`,
                        });
                    })
                    .catch((error) => {
                        if (error.status === 409) {
                            // Kiểm tra mã trạng thái lỗi
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Voucher mã ${voucherId} đang được sử dụng và không thể xóa.`,
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Xóa Voucher ${voucherId} thất bại`,
                            });
                        }
                    });
            }
        });
    };

    //RESET FORM VOUCHER
    $scope.resetForm = function () {
        // Kiểm tra xem có tham số "id" và "data" trong URL không, và nếu có thì xóa chúng
        if ($location.search().id || $location.search().data) {
            $location.search("id", null);
            $location.search("data", null);
        }
        // Gán giá trị cho editingBrand và isEditing
        $scope.selectedCategories = [];
        $scope.edittingVoucher = {};
        $scope.isEditing = false;

        // Chuyển hướng lại đến trang /brand-form
        $location.path("/voucher-form");
    };

    //FORMAT DATE
    $scope.formatDate = function (date) {
        if (date == null) {
            return "";
        }
        var formattedDate = new Date(date);
        var year = formattedDate.getFullYear();
        var month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
        var day = formattedDate.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

        $scope.loadVouchers();
    }
);

//Thông báo Success
function showSuccess(message) {
    Swal.fire({
        icon: "success",
        title: "Thành công",
        text: message,
    });
}

//Thông báo Error
function showError(message) {
    Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: message,
    });
}
