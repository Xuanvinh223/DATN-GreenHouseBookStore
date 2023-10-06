app.controller('inventoryCtrl', inventoryCtrl);

function inventoryCtrl($scope, $http, jwtHelper, $location, $routeParams) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản lý Kho Hàng');
    });
    let host = "http://localhost:8081/rest";
    //khai báo biến
    $scope.listSuppliers = [];

    //biến trả về
    $scope.searchProductResults = [];
    $scope.listProductDetailsResult = [];
    $scope.selectedProducts = [];

    $scope.searchProductKeyword = null;

    // Hàm Save
    $scope.saveImportInvoice = function (active) {
        var check = $scope.checkErrors();
        if (check) {
            $scope.createDateFormat = moment();
            var createDate = moment($scope.createDateFormat, 'YYYY-MM-DDTHH:mm:ss.SSS').format("YYYY-MM-DD HH:mm:ss.SSS");

            var importInvoiceDTO = {
                importInvoice: {
                    //   importInvoiceId: $scope.item.importInvoiceId,
                    username: $scope.username,
                    createDate: new Date(),
                    amount: $scope.TotalAmount,
                    supplierId: $scope.item.supplierId,
                    description: $scope.item.description,
                    status: active
                },
                importInvoiceDetails: $scope.selectedProducts
            };

            // Gửi dữ liệu lên máy chủ
            $http.post(`${host}/importInvoice`, importInvoiceDTO)
                .then(function (response) {
                    // Xử lý phản hồi từ máy chủ (nếu cần)
                    console.log('Dữ liệu đã được lưu thành công.', response);
                    // Sau khi lưu thành công, bạn có thể làm các công việc khác như làm mới trang hoặc hiển thị thông báo.
                })
                .catch(function (error) {
                    // Xử lý lỗi nếu có
                    console.error('Lỗi khi gửi dữ liệu: ', error);
                    // Hiển thị thông báo hoặc xử lý lỗi khác nếu cần.
                });
        }else{
            console.log("Lỗi mẹ ròi");
        }
        // Tạo một đối tượng ImportInvoiceDTO từ các dữ liệu bạn đã thu thập trong controller

    };

    //checkLoi
    $scope.reset = function () {

    }
    // var errors = 0;
      $scope.item={};
    $scope.checkErrors = function () {
        $scope.errors = {};
      
        var supplier = $scope.item.supplierId;
        var description = $scope.item.description;
    
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
        var hasErrors = Object.keys($scope.errors).length > 0;
    
        return !hasErrors;
    };
    


    $scope.getData = function () {

        var url = `${host}/getInventory`;
        $http.get(url).then((resp) => {
            $scope.listSuppliers = resp.data.suppliers;
            $scope.listimportInvoice = resp.data.importInvoice;
            $scope.listProductDetails = resp.data.listProductDetails;
            console.log("", resp.data.listProductDetails)
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

    $scope.calculateTotal = function (item) {
        item.amount = item.quantity * item.price;
        $scope.updateQuantityItemInInvoices();
    };

    $scope.updateQuantityItemInInvoices = function () {
        $scope.TotalAmount = 0.0;
        $scope.selectedProducts.forEach(function (c) {
            $scope.TotalAmount += parseFloat(c.amount);
        });
        // alert(  $scope.TotalAmount)
    };

    $scope.removeProduct = function (index) {
        // Sử dụng index để xác định hàng cần xóa và loại bỏ nó khỏi danh sách selectedProducts
        $scope.selectedProducts.splice(index, 1);
    };

    function init() {
        var token = localStorage.getItem('token');
        if (token) {
            var decodedToken = jwtHelper.decodeToken(token);
            $scope.username = decodedToken.sub;
            console.log("username:", $scope.username);
        }
        $scope.currentDateTime = moment();

        // Định dạng ngày giờ theo định dạng bạn muốn (ví dụ: "DD/MM/YYYY HH:mm:ss")
        $scope.formattedDateTime = $scope.currentDateTime.format('DD/MM/YYYY HH:mm A');
        $scope.getData();

    }

    // Gọi hàm callback để kiểm tra và sử dụng jwtHelper
    init();

}