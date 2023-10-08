app.controller('inventoryCtrl', inventoryCtrl);

function inventoryCtrl($scope, $http, jwtHelper, $location, $routeParams, $interval) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản lý Kho Hàng');
    });
    let host = "http://localhost:8081/rest";
    //khai báo biến
    $scope.listSuppliers = [];
    $scope.currentDateTime = moment();
    $scope.formattedDateTime = $scope.currentDateTime.format('DD/MM/YYYY HH:mm A');
    //biến trả về
    $scope.searchProductResults = [];
    $scope.listProductDetailsResult = [];

    // DECLARE REQUEST DATA - START
    $scope.selectedProducts = [];
    $scope.form = {
        importInvoiceId: null,
        username: null,
        suppliers: { supplierId: null },
        description: null,
        importInvoiceAmount: 0,
    }
    $scope.deletedImportInvoiceDetails = [];
    // DECLARE REQUEST DATA - END

    $scope.searchProductKeyword = null;

    // Hàm Save
    $scope.saveImportInvoice = function (active) {
        var check = true;
        if (check) {
            $scope.createDateFormat = moment();

            var supplier = $scope.listSuppliers.find(e => {
                return e.supplierId === $scope.form.suppliers.supplierId;
            })

            var importInvoiceDTO = {
                importInvoice: {
                    importInvoiceId: $scope.form.importInvoiceId | null,
                    username: $scope.form.username,
                    createDate: new Date(),
                    amount: $scope.form.importInvoiceAmount,
                    suppliers: supplier,
                    description: $scope.form.description,
                    status: active
                },
                importInvoiceDetails: $scope.selectedProducts,
                deletedImportInvoiceDetails: $scope.deletedImportInvoiceDetails
            };

            console.log(importInvoiceDTO);

            $http.post(`${host}/importInvoice`, importInvoiceDTO)
                .then(function (response) {
                    $scope.getData();
                    console.log('Dữ liệu đã được lưu thành công.', response);
                })
                .catch(function (error) {
                    console.error('Lỗi khi gửi dữ liệu: ', error);
                });
        }
    };

    $scope.remove = function () {
       
    }

    $scope.edit = function (id) {
        var url = `${host}/importInvoiceEdit/${id}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.selectedProducts = angular.fromJson(resp.data.selectedProducts);

                $scope.form = resp.data.importInvoice;
                console.log($scope.form);
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    $scope.resetForm = function () {
        $scope.form = {
            importInvoiceId: null,
            username: $scope.username,
            suppliers: { supplierId: null },
            description: null,
            importInvoiceAmount: 0,
        }
    };

    $scope.resetInventoryModal = function () {
        $scope.selectedProducts = [];
        $scope.deletedImportInvoiceDetails = [];
        $scope.resetForm();
    };


    $('#inventoryModal').on('hidden.bs.modal', function () {
        $scope.$apply(function () {
            console.log('Modal đã đóng lại');
            $scope.resetInventoryModal();
        });
    });

    $scope.checkErrors = function () {
        $scope.errors = {};

        var supplier = $scope.form.supplierId;
        var description = $scope.form.description;

        if (!supplier) {
            $scope.errors.supplierId = 'Vui lòng chọn nhà cung cấp';
        }

        if (!description) {
            $scope.errors.description = 'Vui lòng nhập ghi chú';
        }

        if (!$scope.selectedProducts || $scope.selectedProducts.length === 0) {
            $scope.errors.products = 'Vui lòng chọn ít nhất một sản phẩm';
        }

        // Kiểm tra nếu có bất kỳ lỗi nào xuất hiện
        if ($scope.errors) {
            return false;
        } else {
            return true;
        }

    };



    $scope.getData = function () {

        var url = `${host}/getInventory`;
        $http.get(url).then((resp) => {
            $scope.listSuppliers = resp.data.suppliers;
            $scope.listImportInvoice = resp.data.importInvoices;
            $scope.listProductDetails = resp.data.listProductDetails;
            console.log("", resp.data.importInvoices)
            $scope.loadModelProduct();
        }).catch((Error) => {
            console.log("Error: ", Error);
        });
    }
    $scope.loadModelProduct = function () {
        $scope.listProductDetailsResult = [];
        $scope.listProductDetails.filter(function (item) {
            if (item.product.status === true) {
                $scope.listProductDetailsResult.push(item);
            }
        });
        console.log("Danh sách sản phẩm có status = 1:", $scope.listProductDetailsResult);

    }
    $scope.searchProduct = function (keyword) {
        $scope.searchProductResults = [];
        if (keyword) {
            keyword = keyword.toLowerCase();
            $scope.listProductDetailsResult.forEach(function (productD) {
                if (productD.product.productName.toLowerCase().includes(keyword)) {
                    $scope.searchProductResults.push(productD);
                }
            });
        } else {
            $scope.searchProductKeyword = null;
        }
    };
    $scope.selectedProduct = function (product) {
        var cart = {
            productDetail: product,
            quantity: 1,
            price: 0,
            amount: 0,
        };
        var duplicateProduct = true;
        $scope.selectedProducts.forEach(function (p) {
            if (p.productDetail.productDetailId == product.productDetailId) {
                p.quantity++;
                duplicateProduct = false;
            }
        })

        if (duplicateProduct) {
            $scope.selectedProducts.push(cart);
        }
        console.log("Sản phẩm đã chọn: ", $scope.selectedProducts);
        $scope.searchProduct(null);
    }
    $scope.calculateTotal = function () {
        $scope.form.importInvoiceAmount = 0;
        $scope.selectedProducts.forEach(e => {
            $scope.form.importInvoiceAmount += e.price * e.quantity;
        });
    };


    $scope.removeProduct = function (index) {
        $scope.deletedImportInvoiceDetails.push($scope.selectedProducts[index]);
        $scope.selectedProducts.splice(index, 1);

    };


    function init() {
        var token = localStorage.getItem('token');
        if (token) {
            var decodedToken = jwtHelper.decodeToken(token);
            $scope.username = decodedToken.sub;
            $scope.form.username = $scope.username;
            console.log("username:", $scope.username);
        }

        $interval(function () {
            $scope.currentDateTime = moment();
            $scope.formattedDateTime = $scope.currentDateTime.format('DD/MM/YYYY HH:mm A');
            console.log("update time");
        }, 60000);

        $scope.getData();

    }

    // Gọi hàm callback để kiểm tra và sử dụng jwtHelper
    init();

}