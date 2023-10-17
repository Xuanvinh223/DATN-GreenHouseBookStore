app.controller('loginController', function ($scope, $http, jwtHelper, authenticateAPI) {
    var authenticateAPI = 'http://localhost:8081/api/client/authenticate'; // Thay thế bằng URL của API của bạn

    $scope.login = function () {

        // Tạo dữ liệu từ ng-model của bạn
        // var data = {
        //     username: $scope.userData.username,
        //     password: $scope.userData.password
        // };
        var data = {
            username: "",
            password: ""
        };

        // Gửi POST request đến API
        $http.post(authenticateAPI, data)
            .then(function (resp) {
                var status = resp.data.status;
                var message = resp.data.message;
                if (status == 401) {
                    $scope.loginError = message;
                } else if (status == 403) {
                    $scope.loginError = message;
                } else if (status == 404) {
                    $scope.loginError = message;
                } else {
                    // Xử lý khi gọi API thành công
                    localStorage.setItem('token', resp.data.token);
                    // ... xử lý khác ...
                    window.location.href = '/index';
                }
            })
    };
})