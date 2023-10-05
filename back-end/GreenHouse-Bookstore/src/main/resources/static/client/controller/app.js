const app = angular.module("myApp", ["angular-jwt"]);

app.constant("authenticateAPI", "http://localhost:8081/authenticate");
app.constant("signupAPI", "http://localhost:8081/sign-up");

app.run(function ($rootScope, $http, $templateCache, jwtHelper) {
    var jsFiles = [
        "js/custom.js",
        "js/code.js",
        "js/login-register.js",
        "js/plugins.js",
    ]; // Danh sách các tệp JavaScript

    function loadAndAppendScript(jsFile) {
        return $http.get(jsFile).then(function (response) {
            $templateCache.put(jsFile, response.data);
            var scriptElement = document.createElement("script");
            scriptElement.innerHTML = $templateCache.get(jsFile);
            document.body.appendChild(scriptElement);
            return Promise.resolve();
        });
    }

    $rootScope.$on("$viewContentLoaded", function () {
        Promise.all(jsFiles.map(loadAndAppendScript));
    });

    function checkTokenExpiration() {
        var token = localStorage.getItem("token");
        if (token) {
            if (jwtHelper.isTokenExpired(token)) {
                // Token đã hết hạn, xoá nó khỏi local storage
                localStorage.removeItem("token");
                // Chuyển hướng đến trang /login
                window.location.href = "/login";
            }
        }
    }

    // Gọi hàm kiểm tra khi trang được tải lại và sau mỗi khoảng thời gian (ví dụ: mỗi 30 phút)
    window.onload = function () {
        checkTokenExpiration();
        setInterval(checkTokenExpiration, 1000 * 30); // 30 phút
    };


});

// Tạo một interceptor
app.factory("tokenInterceptor", [
    "$window",
    "$location",
    function ($window, $location) {
        return {
            request: function (config) {
                var token = $window.localStorage.getItem("token");
                // Kiểm tra nếu token tồn tại
                if (token) {
                    config.headers["Authorization"] = "Bearer " + token;
                }
                return config;
            },
            responseError: function (response) {
                // Kiểm tra nếu mã trạng thái là 401 Unauthorized (token hết hạn)
                if (response.status === 401) {
                    // Token đã hết hạn, xoá nó khỏi local storage
                    $window.localStorage.removeItem("token");
                    // Chuyển hướng đến trang /login
                    window.location.href = "/login";
                }
                return response;
            },
        };
    },
]);

// Đăng ký interceptor vào ứng dụng
app.config([
    "$httpProvider",
    function ($httpProvider) {
        $httpProvider.interceptors.push("tokenInterceptor");
    },
]);
