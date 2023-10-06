app.controller("InventoryStatic", InventoryStatic);

function InventoryStatic($scope, $http) {
    let host = "http://localhost:8081/rest/inventory-static";
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || 'Thống kê hàng tồn kho');
    });
    // JavaScript để ẩn các dòng con khi trang được tải lại hoặc chạy lần đầu
    $(document).ready(function () {
        $(".nested-row").hide();
    });

    // JavaScript để hiển thị và ẩn bảng con khi nhấn vào dòng
    $(document).ready(function () {
        $(".table-row").click(function () {
            var nestedRow = $(this).next(".nested-row");
            nestedRow.toggle();
        });
    });
    $scope.editingInventoryStatics = {};
    $scope.isEditing = false;
    $scope.inventorystatics = [];
    $scope.inventorystaticsdesc = [];

    $scope.categories = [];

    $scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang

    $scope.loadInventoryStatics = function () {
        var url = `${host}`;
        $http.get(url)
            .then(function (resp) {
                console.log("Response data:", resp.data);
                $scope.inventorystatics = resp.data.list1;
                $scope.inventorystaticsdesc = resp.data.list2;
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
