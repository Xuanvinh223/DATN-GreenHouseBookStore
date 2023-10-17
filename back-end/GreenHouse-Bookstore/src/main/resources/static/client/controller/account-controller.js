app.controller('accountController', accountController);

function accountController($http, $window, $scope, jwtHelper, $timeout) {
    let host = "http://localhost:8081/rest";

    var token = localStorage.getItem('token');
    if (token) {
        var decodedToken = jwtHelper.decodeToken(token);
        $scope.username = decodedToken.sub;
        console.log($scope.username);
        $scope.listAddress = [];// Khởi tạo biến để lưu trữ thông tin địa chỉ

        $scope.loadData = function (username) {
            var url = `${host}/address/${username}`;
            $http
                .get(url)
                .then(function (resp) {
                    var listAddress = resp.data.listAddress;
                    // Kiểm tra nếu danh sách không rỗng và có ít nhất một địa chỉ
                    if (Array.isArray(listAddress) && listAddress.length > 0) {
                        $scope.listAddress = listAddress;
                        console.log("Danh Sách Địa Chỉ", $scope.listAddress);
                    } else {
                        console.log("Không tìm thấy địa chỉ cho người dùng này.");
                    }
                })
                .catch(function (error) {
                    console.log("Error", error);
                });
        };

        // Gọi hàm loadData với tên người dùng hiện tại
        $scope.loadData($scope.username);
    }

    function refesh() {
        $http.get('https://provinces.open-api.vn/api/p/').then(resp => {
            $scope.provinceList = resp.data;
            console.log("DỮ LIỆU CỦA T ĐÂU:", resp);
        }).catch(error => {
            console.log("Error", error);
        })

    }

    refesh();
    initJavascript();
}

// Mã JavaScript cho Javasricpt
function initJavascript() {

    const statusButtons = document.querySelectorAll('.order-status-button');

    statusButtons.forEach(button => {
        button.addEventListener('click', () => {
            statusButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    const changePasswordCheckbox = document.getElementById("change_password_checkbox");
    const passwordFields = document.getElementById("password_fields");

    changePasswordCheckbox.addEventListener("change", function () {
        if (this.checked) {
            passwordFields.style.display = "block";
        } else {
            passwordFields.style.display = "none";
        }
    });
}