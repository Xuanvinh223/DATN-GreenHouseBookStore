const app = angular.module("myApp", ["angular-jwt", "ngCookies", "ngRoute", "angularUtils.directives.dirPagination"]);
app.constant('authenticateAPI', 'http://localhost:8081/authenticate');
app.constant('signupAPI', 'http://localhost:8081/sign-up');
app.constant('checkOutAPI', 'http://localhost:8081/customer/rest/check-out');
app.constant('productPageAPI', 'http://localhost:8081/customer/rest/product-page');
app.constant('cartAPI', 'http://localhost:8081/customer/rest/cart');
app.constant('changePasswordAPI', 'http://localhost:8081/customer/rest/reset-password');
app.constant('forgotPasswordAPI', 'http://localhost:8081/customer/rest/forgot-password');
app.constant('productDetailAPI', 'http://localhost:8081/customer/rest/product-detail');
app.constant('voucherAPI', 'http://localhost:8081/customer/rest/voucher');
app.constant('notifyAPI', "http://localhost:8081/customer/notify")
app.run(function ($rootScope, $http, $templateCache, jwtHelper, $cookies) {
    var token = $cookies.get("token");

    if (token) {
        localStorage.setItem("token", token);
        $cookies.remove("token");
    }

    var jsFiles = [
        "js/custom.js",
        "js/code.js",
        "js/login-register.js",
        "js/plugins.js"
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
});

app.factory("AuthService", function ($window) {
    var service = {};

    service.logout = function () {
        $window.localStorage.removeItem("token");
        $window.localStorage.removeItem("username");
        $window.localStorage.removeItem("fullName");
        window.location.href = "/logout";
    };

    return service;
});

// Đăng ký interceptor vào ứng dụng
app.config([
    "$httpProvider",
    function ($httpProvider) {
        $httpProvider.interceptors.push("tokenInterceptor");
    },
]);

// ================= MAIN CONTROLLER ==================
app.controller("MainController", function ($scope, CartService, $timeout,  ProductDetailService, NotifyService, NotifyWebSocketService) {
    var token = localStorage.getItem("token");
    var username = localStorage.getItem("username");
    $scope.token = token;
    $scope.currentPage = 1;
    $scope.ListNotifyUser = [];

    // Khi trang được nạp, kết nối tới WebSocket
    NotifyWebSocketService.connect(function() {
        loadNotifications();
    });
    
    // Thay thế REST API call bằng WebSocket call
    function loadNotifications() {
        NotifyWebSocketService.getNotifications(function (ListNotifyUser) {
            $scope.ListNotifyUser = ListNotifyUser;
         
            $scope.$apply();
        });
    }
    

    $scope.sendNotification = function (title, message) {
        NotifyWebSocketService.sendNotification(title, message);
        NotifyWebSocketService.connect(function() {
            loadNotifications();
        });
    }

    $scope.addToCart = function (productDetailId, quantity) {
        CartService.addToCart(productDetailId, quantity, username)
            .then(function (response) {
                $scope.showNotification(response.status, response.message);
                $scope.getCart();
            })
            .catch(function (error) {
                console.log(
                    "error",
                    "Lỗi trong quá trình gửi dữ liệu lên server: " + error
                );
            });
    };
    $scope.getCart = function () {
        CartService.getCart(username)
            .then(function (response) {
                $scope.listCartHeader = response.listCart;
            })
            .catch(function (error) {
                console.log(
                    "error",
                    "Lỗi trong quá trình gửi dữ liệu lên server: " + error
                );
            });
    };

    $scope.updateUserInfo = function () {
        var username = localStorage.getItem("username");
        if (username) {
            $scope.getCart();
        } else {
            $scope.getCart();
        }
    };

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
        var notification = { type: type, message: message };
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
    // =========== LOADER =============================
    $scope.isLoading = false;
    // Hàm để hiển thị loading
    $scope.showLoading = function () {
        $scope.isLoading = true;
    };

    // Hàm để ẩn loading
    $scope.hideLoading = function () {
        $scope.isLoading = false;
    };
    //=============PRODUCT DETAIL========================
    $scope.getProductDetail = function (productDetailId) {
        ProductDetailService.getProductDetailById(productDetailId)
            .then(function (response) {
                window.location.href = '/product-details?id=' + productDetailId;
            })
            .catch(function (error) {
                console.log('Lỗi khi lấy dữ liệu sản phẩm: ' + error);
            });
    };

}
);
//================================================================================================================================
// ====================================== SERVICE ======================================
// =============== CART SERVICE =============
app.service("CartService", function ($http, cartAPI) {
    this.addToCart = function (productDetailId, quantity, username) {
        var url = cartAPI + "/add";

        var data = {
            productDetailId: productDetailId,
            quantity: quantity,
            username: username,
        };

        return $http
            .post(url, data)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    this.getCart = function (username) {
        var url = cartAPI + "/getCart?username=" + username;

        return $http
            .get(url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    this.updateQuantity = function (cartId, quantity) {
        var url = cartAPI + "/updateQuantity";

        var data = {
            cartId: cartId,
            quantity: quantity,
        };

        return $http
            .post(url, data)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }

    this.removeCartItem = function (cartId) {
        var url = cartAPI + '/remove'

        return $http.post(url, cartId)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }

});
// =============== PRODUCT SERVICE =============

app.service('ProductDetailService', function ($http, productDetailAPI) {
    this.getProductDetailById = function (productDetailId) {
        var url = `${productDetailAPI}/${productDetailId}`;
        return $http.get(url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log('Lỗi khi lấy dữ liệu:', error);
                return Promise.reject(error);
            });
    };
});
//=============== NOTIFY SERVICE  ===========
app.service('NotifyService', function (NotifyWebSocketService) {
    this.ListNotifyUser = [];

    this.getNotificationsByUsername = function (username) {
        // Sử dụng WebSocket để lấy thông báo
        return new Promise(function (resolve, reject) {
            NotifyWebSocketService.getNotifications(username, function (notifications) {
                // Lọc và xử lý thông báo nếu cần
                resolve(notifications);
            });
        });
    };
});

app.service('NotifyWebSocketService', function ($rootScope) {
    var stompClient = null;
    var isConnecting = false;
    var currentUsername = localStorage.getItem("username"); // Lấy giá trị username từ localStorage

    this.connect = function (callback) {
        if (isConnecting) {
            return;
        }
        isConnecting = true;

        var socket = new SockJS('/notify');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            isConnecting = false;
            console.log('Đã kết nối: ' + frame);

            // Sau khi kết nối đã được thiết lập, gọi hàm callback nếu được cung cấp
            if (callback) {
                callback();
            }
        });
    };

    this.subscribeToNotifications = function (callback) {
        if (stompClient && stompClient.connected) {
            stompClient.subscribe('/topic/notifications/' + currentUsername, function (notification) {
                callback(JSON.parse(notification.body));
            });
        } else {
            this.connect(function () {
                this.subscribeToNotifications(callback);
            });
        }
    };

    this.sendNotification = function (title, message) {
        if (stompClient && stompClient.connected) {
            var model = {
                username: {username:currentUsername},
                title: title,
                message: message,
                createAt: new Date()
            };
            stompClient.send("/app/notify", {}, JSON.stringify(model));
        } else {
            this.connect(function () {
                this.sendNotification(title, message);
            });
        }
    };

    this.getNotifications = function (callback) {
        if (stompClient && stompClient.connected) {
            stompClient.send("/app/notify/getNotifications/" + currentUsername, {}, "");
        } else {
            this.connect(function () {
                this.getNotifications(callback);
            });
        }

        stompClient.subscribe('/topic/notifications', function (response) {
            var notifications = JSON.parse(response.body);
            callback(notifications);
        });
    };
});










