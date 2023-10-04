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

    $scope.importInvoice = {
        importInvoiceId: 0,
        username: null,
        createDate: new Date(),
        amount: 0.0,
        supplierId: null,
        description: null,
        status: null
    };
    $scope.getData = function () {

        var url = `${host}/getInventory`;
        $http.get(url).then((resp) => {
            $scope.listSuppliers = resp.data.suppliers;
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
            productDetailId: product,
            quantity: 1,
            price: 0,
            amount: 0,
        };
        var duplicateProduct = true;
        $scope.selectedProducts.forEach(function (p) {
            if (p.productDetailId.productDetailId == product.productDetailId) {
                p.quantity++;
                duplicateProduct = false;
            }
        })

        if (duplicateProduct) {
            $scope.selectedProducts.push(cart);
        }

        // $scope.updateInvoice();


        console.log("Sản phẩm đã chọn: ", $scope.selectedProducts);
        $scope.searchProduct(null);
    }

    $scope.calculateTotal = function(item) {
        item.amount = item.quantity * item.price;
        $scope.updateQuantityItemInInvoices ();
    };
    
    $scope.updateQuantityItemInInvoices = function () {
        $scope.totalAmount = 0.0;
        $scope.selectedProducts.forEach(function (c) {
            $scope.totalAmount += parseFloat(c.amount);
        });
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