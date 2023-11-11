app.controller("flashSaleController", function ($scope, $timeout, $http, jwtHelper) {
    let host = "http://localhost:8081/customer/rest/flashsale";

    // Hàm để lấy dữ liệu từ REST API và hiển thị Flash Sales có 'userDate' trong ngày hiện tại
 // Hàm để lấy dữ liệu từ REST API và hiển thị Flash Sales có 'userDate' và 'startTime' trong ngày hiện tại
// Hàm để lấy dữ liệu từ REST API và hiển thị Flash Sales có 'userDate' trong ngày hiện tại
function getDataFlashSale() {
    $http.get(host).then(function(response) {
        $scope.listFlash_Sales = response.data.listFlash_Sales;

        // Lấy ngày hiện tại
        var currentDate = new Date();

        // Lọc các Flash Sales theo 'userDate' trong ngày hiện tại và kiểm tra khung giờ
        $scope.filteredFlashSales = $scope.listFlash_Sales.filter(function(flashSale) {
            var userDate = new Date(flashSale.userDate);
            userDate.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây của 'userDate' thành 0

            // So sánh 'userDate' với ngày hiện tại
            if (userDate.getTime() === currentDate.getTime()) {
                var startTime = new Date(flashSale.startTime);
                var endTime = new Date(flashSale.endTime);

                // So sánh khung giờ hiện tại với startTime và endTime
                if (currentDate >= startTime && currentDate <= endTime) {
                    flashSale.saleStatus = "Đang diễn ra";
                } else if (currentDate < startTime) {
                    flashSale.saleStatus = "Sắp diễn ra";
                }
                return true;
            }
            return false;
        });
        console.log($scope.filteredFlashSales);
    }, function(error) {
        console.error("Lỗi khi gọi API: " + error);
    });
}


    // Hàm để tính toán trạng thái của Flash Sale (Đang diễn ra hoặc Sắp diễn ra)

    getDataFlashSale();
});
