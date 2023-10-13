app.controller(
    "loginController",
    function ($scope, $http, jwtHelper, authenticateAPI) {
        var host = authenticateAPI; // Thay thế bằng URL của API của bạn

        $scope.login = function () {
            // Tạo dữ liệu từ ng-model của bạn
            var data = {
                username: $scope.userData?.username,
                password: $scope.userData?.password,
            };

            // Gửi POST request đến API
            $http
                .post(host, data)
                .then(function (resp) {
                    var status = resp.status;
                    var message = resp.data.message;
                    if (status == 200) {
                        localStorage.setItem("username", data.username)
                        localStorage.setItem("token", resp.data.token);
                        window.location.href = "/index";
                    } else {
                        Swal.fire({
                            title: "Thông báo",
                            text: message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch(function (error) {
                    // Xử lý lỗi ở đây, ví dụ:
                    console.error("Lỗi trong quá trình gửi yêu cầu: ", error);
                    Swal.fire({
                        title: "Lỗi",
                        text: "Có lỗi xảy ra khi gửi yêu cầu đến máy chủ",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                });
        };
    }
);
