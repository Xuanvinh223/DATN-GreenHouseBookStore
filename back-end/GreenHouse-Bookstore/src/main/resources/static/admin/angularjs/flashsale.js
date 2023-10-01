app.controller('flashsaleController', flashsaleController);
// app.controller('flashsale-formCtrl', flashsale_formCtrl)

var test3 = 0;
// var key5 = null;
var form5 = {};

//Table
function flashsaleController($scope, $http, $location, $routeParams,) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản lý Flash-Sale');
    });
    // ... Các mã xử lý khác trong controller
    //Mảng danh sách chính
    $scope.flashsalelist = [];
    $scope.productfsList = [];
    $scope.productDetailList = [];
    $scope.productList = [];
    // Tạo một danh sách tạm thời để lưu các sản phẩm đã chọn
    $scope.tempSelectedProducts = [];
    $scope.listModelProduct = [];
    $scope.listProductShow = [];
    $scope.searchText = "";

    $scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang
    let host = "http://localhost:8081/rest";

    //load table
    $scope.load_All = function () {
        var url = `${host}/getData`;
        $http.get(url).then(resp => {
            $scope.flashsalelist = resp.data.flashsalelist;
            $scope.productfsList = resp.data.productfsList;
            $scope.productDetailList = resp.data.productDetailList;
            $scope.productList = resp.data.productList;
            console.log("List Product Detail List", resp.data.productList)
            console.log("List FlashSAle List", resp.data.flashsalelist)
            // Cập nhật trạng thái Flash Sale
            // $scope.updateFlashSaleStatus();
            $scope.loadModelProduct();
        }).catch(error => {
            console.log("Error", error);
        });
    }

    //Load model product
    $scope.loadModelProduct = function () {
        $scope.listModelProduct = [];
        $scope.productDetailList.filter(function (item) {
            if (item.product.status === true) {
                $scope.listModelProduct.push(item);
            }
        });
        console.log("Danh sách sản phẩm có status = 1:", $scope.listModelProduct);

    }
    //Kiểm Tra CheckBox
    // Controller
    $scope.selectAllChecked = false; // Biến cho checkbox "Check All"

    $scope.checkAll = function () {
        // Duyệt qua tất cả các sản phẩm và cập nhật trạng thái của từng sản phẩm
        angular.forEach($scope.listModelProduct, function (item) {
            item.selected = $scope.selectAllChecked;
        });
    }

    $scope.updateSelectAll = function () {
        // Kiểm tra xem tất cả các sản phẩm có đều được chọn không
        var allSelected = $scope.listModelProduct.every(function (item) {
            return item.selected;
        });

        // Cập nhật trạng thái của checkbox "Check All"
        $scope.selectAllChecked = allSelected;
    }


    // Sắp xếp
    $scope.sortBy = function (field) {
        if ($scope.sortField === field) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortField = field;
            $scope.reverseSort = false;
        }
    };
    //Save tạm trên model xuống bảng
    $scope.saveTam = function () {
        $scope.tempSelectedProducts = [];
        // Duyệt qua danh sách sản phẩm và thêm các sản phẩm đã chọn vào danh sách tạm thời
        angular.forEach($scope.listModelProduct, function (item) {
            if (item.selected) {
                $scope.tempSelectedProducts.push(item); // Sửa ở đây, thêm $scope.
            }
        });

        // Gán danh sách tạm thời vào danh sách chính
        $scope.listProductShow = $scope.tempSelectedProducts;
        console.log("Sản phẩm đã chọn: ", $scope.listProductShow);
        // Đóng modal
        $('#exampleModal').modal('hide');

        // Thông báo cho người dùng biết rằng sản phẩm đã được thêm thành công
        alert('Sản phẩm đã được thêm vào danh sách tạm thời.');
    };
    //Tính số tiền giảm
    $scope.calculateDiscountedPrice = function (product) {
        if (product.discountPercentage !== undefined && product.discountPercentage !== null) {
            var discountPercentage = parseFloat(product.discountPercentage);
            if (!isNaN(discountPercentage)) {
                var originalPrice = parseFloat(product.price);
                if (!isNaN(originalPrice)) {
                    var discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
                    return discountedPrice.toFixed(2); // Làm tròn đến 2 chữ số thập phân
                }
            }
        }
        return ""; // Trả về chuỗi rỗng nếu dữ liệu không hợp lệ
    };

    //Hàm Xóa Product_FlashSale Tạm
    $scope.removeProduct = function (index) {
        // Sử dụng index để xác định hàng cần xóa và loại bỏ nó khỏi danh sách selectedProducts
        $scope.listProductShow.splice(index, 1);
    };
    //hàm Save 
    $scope.create = function () {
        var url = `${host}/flashsales`;
        var formattedTime = moment($scope.item.startTime, 'hh:mm A').format('HH:mm:ss');
        var formattedEndTime = moment($scope.item.endTime, 'hh:mm A').format('HH:mm:ss');
        var formatUserDate = moment($scope.item.userDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        // Tạo dữ liệu yêu cầu POST từ các trường trong form HTML
        var requestData = {
            flashSale: {
                name: $scope.item.name,
                startTime: formattedTime,
                endTime: formattedEndTime,
                userDate: formatUserDate,
                status: $scope.item.status
            },
            productFlashSales: $scope.listProductShow
        };
        // Duyệt qua danh sách sản phẩm đã chọn và thêm chúng vào danh sách productFlashSales
        angular.forEach($scope.listProductShow, function (product) {
            requestData.productFlashSales.push({
                productDetail: product,
                quantity: product.quantity,
                discountPercentage: product.discountPercentage,
                purchaseLimit: product.purchaseLimit
            });
            console.log(requestData.productFlashSales);
        });

        $http.post(url, requestData).then(resp => {
            console.log("Thêm Flashsale thành công", resp);
            $scope.clearTable();
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: `Thêm Flash Sale thành công`,
            });

        }).catch(error => {
            console.log("Error", error);
            Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: `Thêm Flash Sale thất bại`,
            });
        });
    }

    //Hàm Reset
    $scope.clearTable = function () {
        $scope.item = {};
        $scope.listProductShow = []; // Xóa toàn bộ dữ liệu trong bảng
    };

    //Hàm EDIT
    $scope.edit = function (flashSaleId) {
        var url = `${host}/edit/${flashSaleId}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.item = angular.copy(resp.data);
                $scope.listProductShow = angular.copy(resp.data.productFlashSale);

                $scope.item = angular.extend({}, resp.data, {listProductShow: resp.data.productFlashSale});

                $location
                    .path("/flashsale-form")
                    .search({id: flashSaleId, data: angular.toJson(resp.data)});
            }).catch(function (error) {
            console.log("Error", error);
        });
    }

    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào $scope.item.
        $scope.item = angular.fromJson($routeParams.data);
    }

    $scope.load_All();

}


// $scope.updateFlashSaleStatus = function () {
//     var url = `${host}/updateFlashSaleStatus`;
//     angular.forEach($scope.flashsalelist, function (flashSale) {
//         var currentDate = new Date(); // Lấy ngày hiện tại
//         var useDate = new Date(flashSale.userDate); // Lấy ngày sử dụng từ Flash Sale

//         // Chỉ cập nhật nếu trạng thái không phải là đã sử dụng (3) và sau ngày hiện tại
//         if ( currentDate > useDate) {
//             // Nếu ngày hiện tại lớn hơn ngày sử dụng, cập nhật trạng thái thành đã sử dụng (3)
//             $http.put(url).then(function (response) {
//                 // Xử lý phản hồi thành công
//                 alert(response.data); // Hiển thị thông báo thành công
//             }).catch(function (error) {
//                 // Xử lý lỗi
//                 console.error(error.data); // Log lỗi ra console
//                 alert('Có lỗi xảy ra khi cập nhật trạng thái Flash Sale');
//             });
//         }
//     });

// }


