app.controller('loginController', function ($scope, $http, jwtHelper, authenticateAPI) {
    var authenticateAPI = 'http://localhost:8081/api/client/authenticate'; // Thay thế bằng URL của API của bạn

    $scope.login = function () {

        // Tạo dữ liệu từ ng-model của bạn
        var data = {
            username: $scope.userData?.username,
            password: $scope.userData?.password
        };

        // Gửi POST request đến API
        $http.post(authenticateAPI, data)
            .then(function (resp) {
                var status = resp.data.status;
                var message = resp.data.message;
                if (status == 401) {
                    $scope.loginError = message;
                } else {
                    // Xử lý khi gọi API thành công
                    localStorage.setItem('token', resp.data.token);
                    var token = localStorage.getItem('token');
                    var decodedToken = jwtHelper.decodeToken(token);
                    // Duyệt qua danh sách quyền (authorities)
                    decodedToken.roles.forEach(function (authority) {
                        if (authority.authority === 'ROLE_ADMIN') {
                            var username = decodedToken.sub;
                            // Người dùng có vai trò "ROLE_ADMIN", thực hiện các hành động tương ứng
                            console.log("Người dùng có vai trò ROLE_ADMIN");
                            window.location.href = "/admin/index?token=" + token + "&username=" + username;
                        } else if (authority.authority === 'ROLE_STAFF') {
                            // Người dùng có vai trò "ROLE_STAFF", thực hiện các hành động tương ứng
                            console.log("Người dùng có vai trò ROLE_STAFF");
                        } else {
                            // Xử lý các vai trò khác (nếu cần)
                            console.log("Người dùng có vai trò khác: " + authority.authority);
                            window.location.href = "/index";
                        }
                    });
                }
            })
    };


})