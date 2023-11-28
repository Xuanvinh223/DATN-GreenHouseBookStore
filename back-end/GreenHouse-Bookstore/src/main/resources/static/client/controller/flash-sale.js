// Thêm 'WebSocketService' vào danh sách dependencies của controller
app.controller('flashSaleController', ['$http', '$scope', '$interval', 'WebSocketService',
    function ($http, $scope, $interval, WebSocketService) {
        let host = "http://localhost:8081/customer/rest/productFlashSales";

        // Gọi hàm connectWebSocket khi controller được khởi tạo
        $scope.connectWebSocket = function () {
            WebSocketService.connect($scope.loadData);
        };



        // Hàm load dữ liệu
        $scope.loadData = function () {
            // Tạo mảng promise cho cả hai yêu cầu HTTP
            var promises = [
                $http.get(`${host}`),
                $http.get("http://localhost:8081/customer/rest/flashSales")
            ];

            // Sử dụng Promise.all để chờ cả hai promise hoàn thành
            Promise.all(promises)
                .then((responses) => {
                    // responses[0] chứa kết quả của yêu cầu đầu tiên
                    // responses[1] chứa kết quả của yêu cầu thứ hai
                    $scope.productFlashSales = filterData(responses[0].data);
                    $scope.flashSales = responses[1].data;
                    console.log("DỮ LIỆU SẢN PHẨM FLASH SALES ");
                    startCountdown();
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        };

        // Hàm lọc dữ liệu
        function filterData(data) {
            return data.filter((proFlaSal) => {
                return checkDateAndTime(proFlaSal.flashSaleId.userDate);
            });
        }

        // Hàm kiểm tra điều kiện ngày và thời gian
        function checkDateAndTime(userDate) {
            // Lấy ngày hiện tại
            var currentDate = new Date();
            // Lấy ngày từ userDate của Flash_Sales
            var flashSaleDate = new Date(userDate);
            return flashSaleDate.toDateString() === currentDate.toDateString();
        }
        function startCountdown() {
            $interval(function () {
                angular.forEach($scope.flashSales, function (flash) {
                    var currentTime = new Date();
                    var formattedStartTime = moment(flash.startTime, 'HH:mm:ss').toISOString();
                    var formattedEndTime = moment(flash.endTime, 'HH:mm:ss').toISOString();

                    var startTime = new Date(formattedStartTime);
                    var endTime = new Date(formattedEndTime);
                    var userDate = new Date(flash.userDate);

                    if (userDate > currentTime || startTime > currentTime) {
                        flash.showCountdown = false;

                        // Nếu userDate hoặc startTime lớn hơn currentTime, không bắt đầu đếm ngược
                        return;
                    }

                    if (endTime < currentTime) {
                        flash.showCountdown = false;

                        // Nếu endTime nhỏ hơn currentTime, ngừng đếm ngược
                        flash.hours = '00';
                        flash.minutes = '00';
                        flash.seconds = '00';
                        return;
                    }

                    flash.showCountdown = true;

                    var timeDiff = endTime - currentTime;
                    var seconds = Math.floor((timeDiff / 1000) % 60);
                    var minutes = Math.floor((timeDiff / 1000 / 60) % 60);
                    var hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);

                    // Gán giá trị cho các biến thời gian đếm ngược trong $scope
                    flash.hours = hours < 10 ? '0' + hours : hours;
                    flash.minutes = minutes < 10 ? '0' + minutes : minutes;
                    flash.seconds = seconds < 10 ? '0' + seconds : seconds;

                    console.log('flash.endTime:', flash.endTime);
                    console.log('timeDiff:', timeDiff);
                });
            }, 1000);
        }

        // Gọi hàm connectWebSocket khi controller được khởi tạo
        $scope.connectWebSocket();

        // Gọi hàm load dữ liệu khi controller được khởi tạo
        $scope.loadData();



    }]);