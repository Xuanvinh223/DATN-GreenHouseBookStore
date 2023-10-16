app.controller("StaticOvertime", StaticOvertime);

function StaticOvertime($scope, $http) {

    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || 'Thống kê hàng tồn kho');
        $scope.loadStaticOvertime();
    });
    $scope.isEditing = false;
    $scope.invoice = [];
    $scope.searchText = "";
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    let host = "http://localhost:8081/rest/static_overtime";

    $scope.invoiceRepeat = [];
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang
    $scope.currentPage = 1; // Trang hiện tại
    $scope.itemsPerPage = 5; // Số mục hiển thị trên mỗi trang
    $scope.totalItems = 0; // Tổng số mục
    $scope.maxSize = 5; // Số lượng nút phân trang tối đa hiển thị
    $scope.reverseSort = false; // Sắp xếp tăng dần

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

    $scope.updateVisibleData = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        var endIndex = startIndex + $scope.itemsPerPage;
        $scope.invoiceRepeat = $scope.invoice.slice(startIndex, endIndex);
    };

    $scope.isDataChanged = false;

    $scope.$watch('invoiceRepeat', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.isDataChanged = true;
        }
    }, true);

    $scope.$watchGroup(['currentPage', 'itemsPerPage'], function () {
        if ($scope.isDataChanged) {
            $scope.updateVisibleData();
            $scope.isDataChanged = false; // Đánh dấu đã xử lý sự thay đổi
        }
    });

    // get data
    $scope.loadStaticOvertime = function () {
        var url = `${host}`;
        $http.get(url).then(resp => {
            $scope.invoice = resp.data.invoice;
            $scope.invoiceRepeat = $scope.invoice;
            $scope.invoiceDetails = resp.data.invoiceDetail;
            console.log("Response data:", resp.data);
            $scope.totalItems = $scope.invoice.length;
            $scope.updateVisibleData();
        })
            .catch(error => {
                console.log("Error", error);
            });
    };

    $scope.getListInvoiceDetailByInvoiceId = function (invoiceId) {
        var listInvoiceDetail = $scope.invoiceDetails.filter(a => a.invoice.invoiceId === invoiceId)
        if (listInvoiceDetail) {
            return listInvoiceDetail;
        } else {
            return null;
        }
    }

    const toggleButton = document.getElementById("toggleButtonText");
    const bodyProfitCollapse = document.getElementById("bodyProfitCollapse");
    // Xử lý sự kiện khi nút được nhấn
    toggleButton.addEventListener("click", function () {
        if (bodyProfitCollapse.classList.contains("show")) {
            toggleButton.textContent = "Hiện doanh thu";
        } else {
            toggleButton.textContent = "Ẩn doanh thu";
        }
    });
}
