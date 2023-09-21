app.controller('PublishersController', PublishersController);

function PublishersController($scope, $http) {
    $scope.publishers = [];
    $scope.newPublisher = {}; // Biến mới để lưu thông tin nhà xuất bản mới

    // Hàm để lấy danh sách nxb
    $scope.getPublishers = function () {
        $http
            .get("/api/publishers")
            .then(function (response) {
                $scope.publishers = response.data;
            })
            .catch(function (error) {
                console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
            });
    };

    $scope.clearForm = function () {
        $scope.newPublisher = {}; // Đặt lại biến newPublisher thành một đối tượng trống
    
        // Đặt lại giá trị trống cho các trường dữ liệu trên form
        $scope.newPublisher.PublishersID = "";
        $scope.newPublisher.PublishersName = "";
        $scope.newPublisher.email = "";
        $scope.newPublisher.address = "";
        $scope.newPublisher.description = "";
    
        // Đặt giá trị trường tải lên file về null
        var fileInput = document.getElementById("customFile");
        fileInput.value = null;
    };
    

    $scope.getPublishers();
}
