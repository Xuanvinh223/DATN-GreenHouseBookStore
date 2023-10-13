app.controller("cartController", cartController);
function cartController($http, $scope, cartAPI, CartService) {
    var username = localStorage.getItem("username");

    $scope.checkAll = false;

    $scope.getCart = function () {
        CartService.getCart(username)
            .then(function (response) {
                console.log("Danh sách giỏ hàng: ", response);
                $scope.listCart = response.listCart;
            })
            .catch(function (error) {
                console.log('error', 'Lỗi trong quá trình gửi dữ liệu lên server: ' + error);
            });
    }
    //==============================================================
    $scope.subtractQuantity = function (index) {
        if ($scope.listCart[index].quantity > 1) {
            $scope.listCart[index].quantity--;
            $scope.updateQuantity(index);
        }
    }

    $scope.addQuantity = function (index) {
        if ($scope.listCart[index].quantity < 999) {
            $scope.listCart[index].quantity++;
            $scope.updateQuantity(index);
        }
    }

    $scope.updateQuantity = function (index) {
        var cartId = $scope.listCart[index].cartId;
        var quantity = $scope.listCart[index].quantity;

        CartService.updateQuantity(cartId, quantity)
            .then(function (response) {
                console.log(response);
                if (response.status == "error") {
                    $scope.listCart[index] = response.cart;
                    $scope.showNotification(response.status, response.message);
                }
            })
            .catch(function (error) {
                console.log('error', 'Lỗi trong quá trình gửi dữ liệu lên server: ' + error);
            })
    }

    //==============================================================

    $scope.toggleCheckAll = function () {
        angular.forEach($scope.listCart, function (cart) {
            cart.checked = $scope.checkAll;
        });
    };
    $scope.$watch('listCart', function (newListCart, oldListCart) {
        $scope.checkAll = true; 

        angular.forEach(newListCart, function (cart) {
            if (!cart.checked) {
                $scope.checkAll = false;
            }
        });
    }, true);


    $scope.getCart();
}