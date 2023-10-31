app.controller("cartController", cartController);

function cartController($http, $scope, cartAPI, CartService, $filter) {
    var username = localStorage.getItem("username");

    $scope.listCartItem = [];
    $scope.listCartItemDeleted = [];
    $scope.listCartItemSelected = [];

    $scope.listVouchersOriginal = [];
    $scope.listVouchersMappingCategories = [];
    $scope.listVouchersMappingProducts = [];
    $scope.eligibleVouchers = [];
    $scope.relatedVouchers = [];

    $scope.listProductCategory = [];

    $scope.checkAll = false;
    $scope.isEdit = false;

    $scope.totalBillAmount = 0;


    function getCart() {
        CartService.getCart(username)
            .then(function (response) {
                console.log("Danh sách giỏ hàng: ", response);
                $scope.listCartItem = response.listCart;
            })
            .catch(function (error) {
                console.log('error', 'Lỗi trong quá trình gửi dữ liệu lên server: ' + error);
            });
    }

    function getProductCategory() {
        var url = `${cartAPI}/getProductCategory`;
        $http.get(url)
            .then(function (response) {
                $scope.listProductCategory = response.data.listProductCategory;
                console.log("Danh sách sản phẩm đã phân loại: ", $scope.listProductCategory);
            })
            .catch(function (error) {
                console.error('Lỗi kết nối đến API: ' + error);
            });
    }

    function getVoucherByUsername(username) {
        var url = `${cartAPI}/getVoucher?username=${username}`;
        $http.get(url)
            .then(function (response) {
                $scope.listVouchersOriginal = response.data.listVouchers;
                $scope.listVouchersMappingCategories = response.data.listVouchersMappingCategories;
                $scope.listVouchersMappingProducts = response.data.listVouchersMappingProducts;

                console.log("Danh sách vouchers: ", $scope.listVouchersOriginal);
                console.log("Danh mục vouchers: ", $scope.listVouchersMappingCategories);
                console.log("Sản phẩm vouchers: ", $scope.listVouchersMappingProducts);
            })
            .catch(function (error) {
                console.error('Lỗi kết nối đến API: ' + error);
            });
    }

    // ===========================================================================================
    function getListFilterVoucher(listCartItemSelected) {
        if ($scope.listVouchersOriginal && $scope.listVouchersOriginal.length > 0) {
            $scope.eligibleVouchers = [];
            $scope.relatedVouchers = [];

            angular.forEach($scope.listVouchersOriginal, function (voucher) {
                var isRelated = false;
                var isEligible = false;

                angular.forEach(listCartItemSelected, function (selectedCartItem) {
                    if (voucherIsRelatedToProduct(voucher, selectedCartItem) || voucherIsRelatedToCategory(voucher, selectedCartItem)) {
                        isRelated = true;
                    }
                });

                // Kiểm tra xem mã voucher đáp ứng các tiêu chí sử dụng
                if (isRelated) {
                    isEligible = voucherIsEligible(voucher, listCartItemSelected);
                }

                if (isRelated && isEligible) {
                    if (voucher.moreAmountPercents < 100 && voucher.moreAmountPercents >= 0) {
                        $scope.relatedVouchers.push(voucher);
                    } else {
                        $scope.eligibleVouchers.push(voucher);
                    }
                }
            });
            console.log("===============================");
            console.log("Danh sách voucher gợi ý ( liên quan ): ", $scope.relatedVouchers);
            console.log("Danh sách voucher đủ điều kiện: ", $scope.eligibleVouchers);
            console.log("===============================");
        }
    };
    // ----------------------------------------------
    function voucherIsRelatedToProduct(voucher, cartItem) {
        var isRelated = false;
        var totalAmount = 0;

        angular.forEach($scope.listVouchersMappingProducts, function (vmp) {
            if (vmp.voucherId == voucher.voucherId && vmp.productDetailId == cartItem.productDetail.productDetailId) {
                isRelated = true;
                totalAmount += cartItem.amount;
            }
        })
        if (isRelated) {
            voucher.moreAmount = voucher.minimumPurchaseAmount - totalAmount;
            voucher.moreAmountPercents = (((voucher.minimumPurchaseAmount - totalAmount) / voucher.minimumPurchaseAmount) * 100).toFixed(2);
        }
        return isRelated;
    }

    function voucherIsRelatedToCategory(voucher, cartItem) {
        var isRelated = false;
        var totalAmount = 0;

        angular.forEach($scope.listProductCategory, function (pc) {
            if (pc.product.productId === cartItem.productDetail.product.productId) {

                angular.forEach($scope.listVouchersMappingCategories, function (vmc) {
                    if (vmc.voucherId === voucher.voucherId && vmc.categoryId === pc.category.categoryId) {
                        isRelated = true;
                        totalAmount += cartItem.amount;
                    }
                })
            }
        })
        if (isRelated) {
            voucher.moreAmount = voucher.minimumPurchaseAmount - totalAmount;
            voucher.moreAmountPercents = 100 - (((voucher.minimumPurchaseAmount - totalAmount) / voucher.minimumPurchaseAmount) * 100).toFixed(2);
        }
        return isRelated;
    }

    function voucherIsEligible(voucher) {
        var currentDate = $filter('date')(new Date(), 'yyyy-MM-dd hh-mm-ss');
        var startDate = $filter('date')(voucher.startDate, 'yyyy-MM-dd hh-mm-ss');
        var endDate = $filter('date')(voucher.endDate, 'yyyy-MM-dd hh-mm-ss');
        return (
            voucher.status &&
            startDate <= currentDate &&
            endDate >= currentDate
        );
    }

    function calculateTotalAmount(selectedProducts) {
        var totalAmount = 0;
        angular.forEach(selectedProducts, function (product) {
            totalAmount += product.priceDiscount * product.quantity;
        });
        return totalAmount;
    }

    // ===========================================================================================

    //==============================================================
    $scope.subtractQuantity = function (index) {
        if ($scope.listCartItem[index].quantity > 1) {
            $scope.listCartItem[index].quantity--;
            $scope.updateQuantity(index);
        }
    }

    $scope.addQuantity = function (index) {
        if ($scope.listCartItem[index].quantity < 999) {
            $scope.listCartItem[index].quantity++;
            $scope.updateQuantity(index);
        }
    }

    $scope.updateQuantity = function (index) {
        var cartId = $scope.listCartItem[index].cartId;
        var quantity = $scope.listCartItem[index].quantity;

        CartService.updateQuantity(cartId, quantity)
            .then(function (response) {
                $scope.listCartItem[index] = response.cart;
                if (response.status == 'error') {
                    $scope.showNotification(response.status, response.message);
                }
            })
            .catch(function (error) {
                console.log('error', 'Lỗi trong quá trình gửi dữ liệu lên server: ' + error);
            })
    }

    //----------------------------------------------------------------
    $scope.editCartItem = function () {
        $scope.isEdit = !$scope.isEdit;
    }

    $scope.removeFromCart = function (index) {
        $scope.listCartItem[index].isDeleted = true;
    }

    $scope.undoRemoveFormCart = function (index) {
        $scope.listCartItem[index].isDeleted = false;
    }

    $scope.doneEditCartItem = function () {
        $scope.isEdit = !$scope.isEdit;
        $scope.listCartItem.forEach(e => {
            if (e.isDeleted === true) {
                $scope.listCartItemDeleted.push(e);
            }
        })
        $scope.listCartItem = $scope.listCartItem.filter(function (e) {
            if (e.isDeleted) {
                CartService.removeCartItem(e.cartId);
            }
            return !e.isDeleted;
        });

    }

    //==============================================================================================

    $scope.toggleCheckAll = function () {
        angular.forEach($scope.listCartItem, function (cart) {
            cart.checked = $scope.checkAll;
        });
    };

    $scope.$watch('listCartItem', function (newListCart, oldListCart) {
        $scope.listCartItemSelected = [];
        $scope.checkAll = true;

        angular.forEach(newListCart, function (cart) {
            if (!cart.checked) {
                $scope.checkAll = false;
            } else {
                $scope.listCartItemSelected.push(cart);
            }
        });
        getListFilterVoucher($scope.listCartItemSelected);
        $scope.totalBillAmount = calculateTotalAmount($scope.listCartItemSelected);

    }, true);
    //==============================================================================================
    //==============================================================================================

    $scope.openEventCartPopup = function () {
        var popup = angular.element(document.querySelector('#popup-loading-event-cart'));
        popup.css('display', 'block');
    };

    $scope.closeEventCartPopup = function () {
        var popup = angular.element(document.querySelector('#popup-loading-event-cart'));
        popup.css('display', 'none');
    };

    //==============================================================================================
    //==============================================================================================


    function init() {
        getCart();
        getProductCategory();
        getVoucherByUsername(username);
    }


    init();
}