app.controller("InventoryStatic", InventoryStatic);

function InventoryStatic($scope, $http) {
    let host = "http://localhost:8081/rest/inventory-static";
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || 'Thống kê hàng tồn kho');
        $scope.loadInventoryStatics();
    });
    $scope.editingInventoryStatics = {};
    $scope.isEditing = false;

    $scope.inventorystatics = [];
    $scope.inventorystaticsdesc = [];
    $scope.categories = [];
    $scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions1 = [5, 12, 24, 32, 64, 128];
    $scope.itemsPerPageOptions2 = [5, 12, 24, 32, 64, 128];
    $scope.selectedItemsPerPage1 = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang
    $scope.selectedItemsPerPage2 = 5;
    $scope.currentPage1 = 1;
    $scope.currentPage2 = 1;
    $scope.itemsPerPage1 = 5;
    $scope.itemsPerPage2 = 5;
    $scope.totalItems1 = $scope.inventorystatics.length;
    $scope.totalItems2 = $scope.inventorystaticsdesc.length;
    $scope.maxSize1 = 5;
    $scope.maxSize1 = 5;

    $scope.getNumOfPages1 = function () {
        return Math.ceil($scope.totalItems1 / $scope.itemsPerPage1);
    };
    $scope.getNumOfPages2 = function () {
        return Math.ceil($scope.totalItems2 / $scope.itemsPerPage2);
    };

    // Hàm chuyển đổi trang
    $scope.setPage1 = function (pageNo) {
        $scope.currentPage1 = pageNo;
    };
    $scope.setPage2 = function (pageNo) {
        $scope.currentPage2 = pageNo;
    };

    $scope.calculateRange1 = function () {
        var startIndex1 = ($scope.currentPage1 - 1) * $scope.itemsPerPage1 + 1;
        var endIndex1 = $scope.currentPage1 * $scope.itemsPerPage1;

        if (endIndex1 > $scope.totalItems1) {
            endIndex1 = $scope.totalItems1;
        }

        return startIndex1 + ' đến ' + endIndex1 + ' trên tổng số ' + $scope.totalItems1 + ' mục';
    };
    $scope.calculateRange2 = function () {
        var startIndex2 = ($scope.currentPage2 - 1) * $scope.itemsPerPage2 + 1;
        var endIndex2 = $scope.currentPage2 * $scope.itemsPerPage2;

        if (endIndex2 > $scope.totalItems2) {
            endIndex2 = $scope.totalItems2;
        }

        return startIndex2 + ' đến ' + endIndex2 + ' trên tổng số ' + $scope.totalItems2 + ' mục';
    };
    $scope.loadInventoryStatics = function () {
        var url = `${host}`;
        $http.get(url).then(resp => {
            console.log("Response data:", resp.data);
            $scope.inventorystatics = resp.data.list1;
            $scope.inventorystaticsdesc = resp.data.list2;
            $scope.totalItems1 = $scope.inventorystatics.length;
            $scope.totalItems2 = $scope.inventorystaticsdesc.length;
            // Rest of your code...
        })
            .catch(error => {
                console.log("Error", error);
            });
    };
    // Lấy dữ liệu loại danh mục
    $http
        .get("/rest/categories")
        .then((resp) => {
            $scope.categories = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    // Lấy dữ liệu loại thương hiệu
    $http
        .get("/rest/brand")
        .then((resp) => {
            $scope.brands = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    $scope.Edit = function (key, index) {
        var url = `${host}/${key}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.form = resp.data;
                $scope.selectedItemIndex = index; // Lưu chỉ số sản phẩm đang được chỉnh sửa
                displayImages(resp.data.image); // Hiển thị ảnh tương ứng cho sản phẩm đang chỉnh sửa
            })
            .catch((Error) => {
                console.log("Error", Error);
            });
    };
    $scope.loadInventoryStatics();
}