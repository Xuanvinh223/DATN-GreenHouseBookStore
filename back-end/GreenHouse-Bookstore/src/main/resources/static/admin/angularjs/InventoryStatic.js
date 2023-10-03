app.controller("InventoryStatic", InventoryStatic);

function InventoryStatic($scope, $location, $routeParams, $http) {
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

    $scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang

    $scope.loadInventoryStatics = function () {
        var url = `${host}`;
        $http.get(url)
            .then(function (resp) {
                $scope.inventorystatics = resp.data;
                // Rest of your code...
            })
            .catch(error => {
                console.log("Error", error);
            });
    };
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
