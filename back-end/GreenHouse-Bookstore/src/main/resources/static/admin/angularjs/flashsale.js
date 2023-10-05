app.controller('flashsaleController', flashsaleController);
// app.controller('flashsale-formCtrl', flashsale_formCtrl)

var test3 = 0;
// var key5 = null;
var form5 = {};

//Table
function flashsaleController($scope, $http, $location, $routeParams,) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản lý Flash-Sale');
        $scope.load_All();
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
    $scope.listProductFlashSale = [];
    $scope.listDeletedProductFlashSale = [];
    $scope.searchText = "";

    //$scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    let host = "http://localhost:8081/rest";


    $scope.currentPage = 1; // Trang hiện tại
    $scope.itemsPerPage = 12; // Số mục hiển thị trên mỗi trang
    $scope.totalItems = $scope.flashsalelist.length; // Tổng số mục
    $scope.maxSize = 5; // Số lượng nút phân trang tối đa hiển thị
    $scope.reverseSort = false; // Sắp xếp tăng dần

    // Hàm tính toán số trang dựa trên số lượng mục và số mục trên mỗi trang
    $scope.getNumOfPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm chuyển đổi trang
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    
    
    $scope.calculateRange = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + 1;
        var endIndex = $scope.currentPage * $scope.itemsPerPage;

        if (endIndex > $scope.totalItems) {
            endIndex = $scope.totalItems;
        }

        return startIndex + ' đến ' + endIndex + ' trên tổng số ' + $scope.totalItems + ' mục';
    };

    $scope.searchData = function () {
        // Lọc danh sách gốc bằng searchText
        $scope.flashsalelist = $scope.originalFlashSaleList.filter(function (item) {
            // Thực hiện tìm kiếm trong các thuộc tính cần thiết của item
            return (
                item.flashSaleId.toString().includes($scope.searchText) || item.name.toLowerCase().includes($scope.searchText.toLowerCase())
            );
        });
    };

    //load table
    $scope.load_All = function () {
        var url = `${host}/getData`;
        $http.get(url).then(resp => {
            $scope.originalFlashSaleList = resp.data.flashsalelist;
            $scope.flashsalelist = $scope.originalFlashSaleList;
            $scope.productfsList = resp.data.productfsList;
            $scope.productDetailList = resp.data.productDetailList;
            $scope.productList = resp.data.productList;
            console.log("List Product Detail List", resp.data.productList)
            console.log("List FlashSAle List", resp.data.flashsalelist)
            // Cập nhật trạng thái Flash Sale
            // $scope.updateFlashSaleStatus();
            $scope.loadModelProduct();
            $scope.totalItems = $scope.originalFlashSaleList.length; // Tổng số mục
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
        $scope.listModelProduct.forEach(function (item) {
            if (item.selected) {
                var isDuplicate = $scope.listProductFlashSale.some(function (e) {
                    return e.productDetail.productDetailId === item.productDetailId;
                });

                if (!isDuplicate) {
                    var FlashSaleProduct = {
                        id: null,
                        quantity: 0,
                        usedQuantity: 0,
                        discountPercentage: 0,
                        purchaseLimit: 0,
                        flashSaleId: null,
                        productDetail: item
                    };
                    $scope.listProductFlashSale.push(FlashSaleProduct);
                }
            }
        });

        console.log("Sản phẩm đã chọn: ", $scope.listProductFlashSale);
        $('#exampleModal').modal('hide');
    };



    //Tính số tiền giảm
    $scope.calculateDiscountedPrice = function (product) {
        if (!isNaN(product.discountPercentage)) {
            return product.discountPercentage * product.productDetail.price / 100;
        }
        return 0; // Trả về chuỗi rỗng nếu dữ liệu không hợp lệ
    };

    //Hàm Xóa Product_FlashSale Tạm
    $scope.removeProduct = function (index) {
        // Sử dụng index để xác định hàng cần xóa và loại bỏ nó khỏi danh sách selectedProducts
        $scope.listDeletedProductFlashSale.push($scope.listProductFlashSale[index])
        $scope.listProductFlashSale.splice(index, 1);
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
                flashSaleId: $scope.item.flashSaleId | null,
                name: $scope.item.name,
                startTime: formattedTime,
                endTime: formattedEndTime,
                userDate: formatUserDate,
                status: $scope.item.status
            },
            productFlashSales: $scope.listProductFlashSale,
            listDeletedProductFlashSale: $scope.listDeletedProductFlashSale
        };
        // Duyệt qua danh sách sản phẩm đã chọn và thêm chúng vào danh sách productFlashSales
        console.log(requestData);
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
        $scope.listProductFlashSale = []; // Xóa toàn bộ dữ liệu trong bảng
    };

    //Hàm EDIT
    $scope.edit = function (flashSaleId) {
        var url = `${host}/edit/${flashSaleId}`;
        $http
            .get(url)
            .then(function (resp) {
                $location
                    .path("/flashsale-form")
                    .search({ id: flashSaleId, data: resp.data });
                console.log(resp.data);
            }).catch(function (error) {
                console.log("Error", error);
            });
    }

    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào $scope.item.
        $scope.item = angular.fromJson($routeParams.data.flashSale);
        $scope.listProductFlashSale = angular.fromJson($routeParams.data.listProductFlashSale);
        console.log($scope.listProductFlashSale);
    }


    $scope.formatDate = function (date) {
        if (date == null) {
            return "";
        }
        var formattedDate = new Date(date);
        var year = formattedDate.getFullYear();
        var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
        var day = formattedDate.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

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


