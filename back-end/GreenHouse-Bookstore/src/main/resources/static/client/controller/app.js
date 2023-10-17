const app = angular.module("myApp", ["angular-jwt", "ngCookies"]);

app.constant('authenticateAPI', 'http://localhost:8081/authenticate');
app.constant('signupAPI', 'http://localhost:8081/sign-up');
app.constant('checkOutAPI', 'http://localhost:8081/customer/rest/check-out');
app.constant('productPageAPI', 'http://localhost:8081/customer/rest/product-page');
app.constant('cartAPI', 'http://localhost:8081/customer/rest/cart');

app.run(function ($rootScope, $http, $templateCache, jwtHelper, $cookies) {

    var token = $cookies.get("token");

    if (token) {
        localStorage.setItem("token", token);
        $cookies.remove('token');
    }

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
app.factory("tokenInterceptor", function () {
        return {
            request: function (config) {
                var token = window.localStorage.getItem("token");
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
                    window.localStorage.removeItem("token");
                    // Chuyển hướng đến trang /login
                    window.location.href = "/login";
                }
                return response;
            },
        };
    },
);

// Đăng ký interceptor vào ứng dụng
app.config([
    "$httpProvider",
    function ($httpProvider) {
        $httpProvider.interceptors.push("tokenInterceptor");
    },
]);

// ================= MAIN CONTROLLER ==================
app.controller('MainController', function ($scope, CartService, $timeout, $rootScope) {
    var username = localStorage.getItem('username');

    $scope.addToCart = function (productDetailId, quantity) {
        CartService.addToCart(productDetailId, quantity, username)
            .then(function (response) {
                $scope.showNotification(response.status, response.message);
            })
            .catch(function (error) {
                console.log('error', 'Lỗi trong quá trình gửi dữ liệu lên server: ' + error);
            });
    };
    $scope.getCart = function () {
        CartService.getCart(username)
            .then(function (response) {
                $scope.listCartHeader = response.listCart;
            })
            .catch(function (error) {
                console.log('error', 'Lỗi trong quá trình gửi dữ liệu lên server: ' + error);
            });
    }


    $scope.updateUserInfo = function () {
        var username = localStorage.getItem('username');
        if (username) {
            $scope.getCart();
        } else {
            $scope.getCart();
        }
    }

    $scope.updateUserInfo();

    // ================ SHOW FULL TEXT OR COMPRESS =================================================================
    $scope.showFullText = {};

    $scope.toggleFullText = function (productId) {
        if (!$scope.showFullText[productId]) {
            $scope.showFullText[productId] = true;
        } else {
            $scope.showFullText[productId] = false;
        }
    };

    // =========== NOTIFICATION =============================
    $scope.notifications = [];

    $scope.showNotification = function (type, message) {
        var notification = {type: type, message: message};
        $scope.notifications.push(notification);

        $timeout(function () {
            $scope.removeNotification(notification);
        }, 3000);
    };


    $scope.removeNotification = function (notification) {
        var index = $scope.notifications.indexOf(notification);
        if (index !== -1) {
            $scope.notifications.splice(index, 1);
        }
    };
});
//================================================================================================================================
// ====================================== SERVICE ======================================
// =============== CART SERVICE =============
app.service('CartService', function ($http, cartAPI) {
    this.addToCart = function (productDetailId, quantity, username) {
        var url = cartAPI + '/add';

        var data = {
            productDetailId: productDetailId,
            quantity: quantity,
            username: username
        };

        return $http.post(url, data)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    this.getCart = function (username) {
        var url = cartAPI + '/getCart?username=' + username;

        return $http.get(url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    this.updateQuantity = function (cartId, quantity) {
        var url = cartAPI + '/updateQuantity'

        var data = {
            cartId: cartId,
            quantity: quantity
        }

        return $http.post(url, data)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }

});



