// Đăng ký controller và định nghĩa hàm StaticOvertime
app.controller("StaticOvertime", StaticOvertime);

function StaticOvertime($scope, $http, $filter) {
    // Khai báo và khởi tạo giá trị ban đầu cho biến tổng doanh thu, tổng chi phí, và tổng lợi nhuận
    $scope.totalRevenueBySearch = 0;
    $scope.totalExpenseBySearch = 0;
    $scope.totalProfitBySearch = 0;

    $scope.calculateTotalRevenueForCurrentYear = 0;
    $scope.calculateTotalRevenueForLastYear = 0;
    $scope.calculateTotalRevenueForCurrentMonth = 0;

    // Xử lý sự kiện khi thay đổi route
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || 'Thống kê hàng tồn kho');
        $scope.loadStaticOvertime();
    });

    $scope.errorMessages = {
        dateError: ''
    };

    // Khai báo và khởi tạo biến dữ liệu liên quan đến invoice
    $scope.invoice = [];
    $scope.years = [];
    $scope.searchText = "";
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    let host = "http://localhost:8081/rest/static_overtime";
    $scope.originalInvoice = [];
    $scope.invoiceRepeat = [];
    $scope.selectedItemsPerPage = 5;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.totalItems = 0;
    $scope.maxSize = 5;

    // Hàm tính số trang dựa trên số mục hiển thị và tổng số mục
    $scope.getNumOfPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm chuyển đổi trang
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    // Hàm tính phạm vi hiển thị của mục trên trang
    $scope.calculateRange = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + 1;
        var endIndex = $scope.currentPage * $scope.itemsPerPage;
        if (endIndex > $scope.totalItems) {
            endIndex = $scope.totalItems;
        }
        return startIndex + ' đến ' + endIndex + ' trên tổng số ' + $scope.totalItems + ' mục';
    };

    // Hàm cập nhật dữ liệu hiển thị trên trang
    $scope.updateVisibleData = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        var endIndex = startIndex + $scope.itemsPerPage;
        $scope.invoiceRepeat = $scope.invoice.slice(startIndex, endIndex);
    };

    $scope.isDataChanged = false;

    // Hàm theo dõi thay đổi dữ liệu hiển thị
    $scope.$watch('invoiceRepeat', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.isDataChanged = true;
        }
    }, true);

    // Hàm theo dõi thay đổi trang và số mục hiển thị
    $scope.$watchGroup(['currentPage', 'itemsPerPage'], function () {
        if ($scope.isDataChanged) {
            $scope.updateVisibleData();
            $scope.isDataChanged = false;
        }
    });

    // Hàm tải dữ liệu từ server
    $scope.loadStaticOvertime = function () {
        var url = `${host}`;
        $http.get(url).then(resp => {
            $scope.originalInvoice = resp.data.invoice;
            $scope.invoice = $scope.originalInvoice;
            $scope.invoiceDetails = resp.data.invoiceDetail;
            $scope.totalItems = $scope.invoice.length;
            $scope.calculateTotalRevenueForCurrentYear = resp.data.calculateTotalRevenueForCurrentYear;
            $scope.calculateTotalRevenueForLastYear = resp.data.calculateTotalRevenueForLastYear;
            $scope.calculateTotalRevenueForCurrentMonth = resp.data.calculateTotalRevenueForCurrentMonth;
            $scope.percent = resp.data.percent;
            $scope.years = resp.data.year;
            // $scope.year = resp.data.percent;
            $scope.updateVisibleData();
            $scope.calculateTotalProfit();
            $scope.updateSelectedYear();
            // $scope.calculateMonthlyRevenues($scope.selectedYear); // Thay đổi để truyền năm cụ thể
            // Thêm logic khác (nếu cần) dựa trên dữ liệu được tải từ API
        }).catch(error => {
            console.log("Error", error);
        });
    };

    // Lọc dữ liệu chỉ cho một năm cụ thể (ví dụ: 2023)
    $scope.selectedYear = null;

    $scope.updateSelectedYear = function () {
        // Giá trị đã chọn từ dropdown sẽ được lưu trong biến $scope.selectedYear
        console.log("Năm đã chọn: " + $scope.selectedYear);

        // Gọi hàm tính doanh thu hàng tháng với năm đã chọn
        $scope.calculateMonthlyRevenues($scope.selectedYear);
    };

    $scope.calculateMonthlyRevenues = function (selectedYear) {
        // Phá hủy biểu đồ cũ trước khi tạo biểu đồ mới
        if ($scope.monthlyRevenueChart) {
            $scope.monthlyRevenueChart.destroy();
        }

        $scope.monthlyRevenues = {};

        $scope.invoice.forEach(function (item) {
            var invoiceDate = new Date(item.paymentDate);
            var year = invoiceDate.getFullYear();

            // Chỉ tính doanh thu cho năm đã chọn
            if (year === parseInt(selectedYear)) { // Chuyển đổi selectedYear thành số nguyên (integer)
                var month = invoiceDate.getMonth() + 1;
                var revenue = item.totalAmount;

                var key = year + '-' + (month < 10 ? '0' : '') + month;

                if (!$scope.monthlyRevenues[key]) {
                    $scope.monthlyRevenues[key] = 0;
                }

                $scope.monthlyRevenues[key] += revenue;
            }
        });

        // Tạo biểu đồ mới
        var ctx = document.getElementById('monthlyRevenueChart').getContext('2d');
        var labels = Object.keys($scope.monthlyRevenues);
        var data = labels.map(function (month) {
            return $scope.monthlyRevenues[month];
        });

        $scope.monthlyRevenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };


    $scope.dateNow = new Date();
    $scope.listInvoiceSearch = [];

    // Hàm tìm kiếm dữ liệu dựa trên ngày bắt đầu và ngày kết thúc
    $scope.searchByDate = function () {
        var dateS = $filter('date')($scope.dateStart, "yyyy-MM-dd");
        var dateE = $filter('date')($scope.dateEnd, "yyyy-MM-dd");

        if (dateS === null && dateE === null) {
            $scope.errorMessages.dateError = '';

            // Đặt lại dữ liệu của invoice và invoiceDetails thành dữ liệu mặc định
            $scope.invoice = $scope.originalInvoice;
            $scope.totalItems = $scope.invoice.length;
            $scope.updateVisibleData();
            // $scope.invoiceDetails =filteredInvoiceDetails; // Nếu bạn có dữ liệu mặc định khác

            // Tính lại tổng doanh thu, chi phí và lợi nhuận dựa trên dữ liệu ban đầu
            $scope.calculateTotalProfit();
            return;

        } else if (!dateS || !dateE) {
            $scope.errorMessages.dateError = 'Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc';
            return;
        } else if (dateS > dateE) {
            $scope.errorMessages.dateError = 'Ngày bắt đầu không thể lớn hơn ngày kết thúc';
            return;
        } else {
            $scope.errorMessages.dateError = '';
        }

        // Lọc dữ liệu dựa trên ngày bắt đầu và ngày kết thúc trong bản sao
        var filteredInvoice = $scope.originalInvoice.filter(function (item) {
            var invoiceDate = $filter('date')(item.paymentDate, "yyyy-MM-dd");
            return (invoiceDate >= dateS) && (invoiceDate <= dateE);
        });

        // Cập nhật dữ liệu tìm kiếm cho invoice
        $scope.invoice = filteredInvoice;
        $scope.totalItems = filteredInvoice.length;
        $scope.updateVisibleData();

        // Lọc dữ liệu dựa trên ngày bắt đầu và ngày kết thúc trong invoiceDetails
        var filteredInvoiceDetails = $scope.invoiceDetails.filter(function (item) {
            var invoiceDate = $filter('date')(item.invoice.paymentDate, "yyyy-MM-dd");
            return (invoiceDate >= dateS) && (invoiceDate <= dateE);
        });

        // Cập nhật dữ liệu tìm kiếm cho invoiceDetails
        $scope.invoiceDetails = filteredInvoiceDetails;

        // Tính tổng doanh thu, chi phí và lợi nhuận dựa trên dữ liệu tìm kiếm
        $scope.calculateTotalProfit();
    };

    // Hàm đặt lại bộ lọc
    $scope.resetFilters = function () {
        // Xóa giá trị của ngày bắt đầu và ngày kết thúc
        $scope.dateStart = null;
        $scope.dateEnd = null;

        // Trả lại dữ liệu của bảng về trạng thái ban đầu
        $scope.invoice = $scope.originalInvoice;
        $scope.totalItems = $scope.invoice.length;
        $scope.updateVisibleData();

        // Trả lại dữ liệu của invoiceDetails về trạng thái ban đầu
        $scope.invoiceDetails = resp.data.invoiceDetail;

        // Tính lại tổng doanh thu, chi phí và lợi nhuận dựa trên dữ liệu ban đầu
        $scope.calculateTotalProfit();
    };

    // Hàm tính tổng doanh thu, chi phí và lợi nhuận
    $scope.calculateTotalProfit = function () {
        // Tính tổng doanh thu từ invoiceDetails
        $scope.totalRevenueBySearch = $scope.invoiceDetails.reduce(function (total, item) {
            return total + (item.priceDiscount * item.quantity);
        }, 0);

        // Tính tổng chi phí từ invoiceDetails
        $scope.totalExpenseBySearch = $scope.invoiceDetails.reduce(function (total, item) {
            return total + (item.price * item.quantity);
        }, 0);

        // Tính tổng lợi nhuận
        $scope.totalProfitBySearch = $scope.totalRevenueBySearch - $scope.totalExpenseBySearch;
    };

    // Hàm lấy danh sách chi tiết hóa đơn dựa trên ID hóa đơn
    $scope.getListInvoiceDetailByInvoiceId = function (invoiceId) {
        return $scope.invoiceDetails.filter(a => a.invoice.invoiceId === invoiceId);
    };

    // Xử lý sự kiện bấm nút "Hiện/Ẩn doanh thu"
    const toggleButton = document.getElementById("toggleButtonText");
    const bodyProfitCollapse = document.getElementById("bodyProfitCollapse");
    toggleButton.addEventListener("click", function () {
        if (bodyProfitCollapse.classList.contains("show")) {
            toggleButton.textContent = "Hiện doanh thu";
        } else {
            toggleButton.textContent = "Ẩn doanh thu";
        }
    });
}
