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

    $scope.listNormalVouchers = [];
    $scope.listShippingVouchers = [];
    $scope.listPaymentVouchers = [];

    $scope.numViewNormalVouchers = 2;
    $scope.numViewShippingVouchers = 2;
    $scope.numViewPaymentVouchers = 2;

    $scope.voucherApplied = {
        normalVoucherApplied: null,
        shippingVoucherApplied: null,
        paymentVoucherApplied: null
    }

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
                if (response.data.listVouchers) {
                    angular.forEach(response.data.listVouchers, function (voucher) {
                        voucher.moreAmount = voucher.minimumPurchaseAmount;
                        voucher.moreAmountPercents = 0;
                        $scope.listVouchersOriginal.push(voucher);
                    })
                }
                $scope.listVouchersMappingCategories = response.data.listVouchersMappingCategories;
                $scope.listVouchersMappingProducts = response.data.listVouchersMappingProducts;

                angular.forEach($scope.listVouchersOriginal, v => {
                    if (voucherIsEligible(v)) {
                        if (v.voucherType == "Sản phẩm" || v.voucherType == "Loại sản phẩm") {
                            $scope.listNormalVouchers.push(v);
                        } else if (v.voucherType == "Ship") {
                            $scope.listShippingVouchers.push(v);
                        } else if (v.voucherType == "Hóa đơn") {
                            $scope.listPaymentVouchers.push(v);
                        }
                    }
                })
                console.log("Danh sách vouchers: ", $scope.listVouchersOriginal);

                console.log("VOUCHER OF ", username);
                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                console.log("Danh mục vouchers: ", $scope.listVouchersMappingCategories);
                console.log("Sản phẩm vouchers: ", $scope.listVouchersMappingProducts);

                console.log("------------------------------------------------");
                console.log("Voucher type = Sản phẩm / Loại sản phẩm", $scope.listNormalVouchers);
                console.log("Voucher type = Ship", $scope.listShippingVouchers);
                console.log("Voucher type = Hóa đơn", $scope.listPaymentVouchers);
                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            })
            .catch(function (error) {
                console.error('Lỗi kết nối đến API: ' + error);
            });
    }

    // ===========================================================================================
    function getListFilterVoucher(listCartItemSelected) {
        if (listCartItemSelected) {
            var listVoucher = [];
            angular.forEach($scope.listVouchersOriginal, function (voucher) {
                voucher.moreAmount = voucher.minimumPurchaseAmount;
                voucher.moreAmountPercents = 0;
                listVoucher.push(voucher);
            })
            $scope.listVouchersOriginal = listVoucher;
        }
        if ($scope.listVouchersOriginal && $scope.listVouchersOriginal.length > 0) {
            $scope.eligibleVouchers = [];
            $scope.relatedVouchers = [];

            angular.forEach($scope.listVouchersOriginal, function (voucher) {
                var isRelated = false;
                var isEligible = false;
                // Kiểm tra xem mã voucher đáp ứng các tiêu chí sử dụng
                $scope.totalAmount = 0;

                isEligible = voucherIsEligible(voucher);

                if (isEligible) {
                    angular.forEach(listCartItemSelected, function (selectedCartItem) {
                        if (voucherIsRelatedToProduct(voucher, selectedCartItem) || voucherIsRelatedToCategory(voucher, selectedCartItem)) {
                            isRelated = true;
                        }
                    });
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
        var amount = 0;

        angular.forEach($scope.listVouchersMappingProducts, function (vmp) {
            if (vmp.voucherId == voucher.voucherId && vmp.productDetailId == cartItem.productDetail.productDetailId) {
                isRelated = true;
                amount += cartItem.amount;
            }
        })
        if (isRelated) {
            $scope.totalAmount += amount;
            voucher.moreAmount = voucher.minimumPurchaseAmount - $scope.totalAmount;
            voucher.moreAmountPercents = 100 - (((voucher.minimumPurchaseAmount - $scope.totalAmount) / voucher.minimumPurchaseAmount) * 100).toFixed(2);
        }
        return isRelated;
    }

    function voucherIsRelatedToCategory(voucher, cartItem) {
        var isRelated = false;
        var amount = 0;

        angular.forEach($scope.listProductCategory, function (pc) {
            if (pc.product.productId === cartItem.productDetail.product.productId) {

                angular.forEach($scope.listVouchersMappingCategories, function (vmc) {
                    if (vmc.voucherId === voucher.voucherId && vmc.categoryId === pc.category.categoryId) {
                        isRelated = true;
                        amount += cartItem.amount;
                    }
                })
            }
        })
        if (isRelated) {
            $scope.totalAmount += amount;
            voucher.moreAmount = voucher.minimumPurchaseAmount - $scope.totalAmount;
            voucher.moreAmountPercents = 100 - (((voucher.minimumPurchaseAmount - $scope.totalAmount) / voucher.minimumPurchaseAmount) * 100).toFixed(2);
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

    $scope.isEligibleVoucherPopup = function (voucher) {
        if (voucher) {
            return $scope.eligibleVouchers.some(function (v) {
                return v.voucherId === voucher.voucherId;
            });
        } else {
            return false;
        }
    }


    $scope.isAppliedVoucher = function (voucher) {
        return Object.values($scope.voucherApplied).some(v => v && v.voucherId === voucher.voucherId);
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
                $scope.listCartItemSelected.find(function (item) {
                    if (item.cartId === response.cart.cartId) {
                        response.cart.checked = item.checked
                    }
                });
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
    $scope.removeFromCart = function (index) {
        Swal.fire({
            title: "Xóa sản phẩm?",
            text: "Bạn có muốn xóa sản phẩm khỏi giỏ hàng.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                CartService.removeCartItem($scope.listCartItem[index].cartId);
                $scope.listCartItem.splice(index, 1);
            }
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
    $scope.applyVoucher = function (voucher) {
        const voucherAppliedId = voucher.voucherId;


        const isNormalVoucherApplied = $scope.listNormalVouchers.some(e => e.voucherId === voucherAppliedId);
        const isShippedVoucherApplied = $scope.listShippingVouchers.some(e => e.voucherId === voucherAppliedId);
        const isPaymentVoucherApplied = $scope.listPaymentVouchers.some(e => e.voucherId === voucherAppliedId);

        if (isNormalVoucherApplied) {
            $scope.voucherApplied.normalVoucherApplied = voucher;
        } else if (isShippedVoucherApplied) {
            $scope.voucherApplied.shippingVoucherApplied = voucher;
        } else if (isPaymentVoucherApplied) {
            $scope.voucherApplied.paymentVoucherApplied = voucher;
        }

        console.log("Voucher đã áp dụng: ", $scope.voucherApplied);
    }

    $scope.toggleVoucherApplied = function (voucher) {
        if ($scope.voucherApplied.normalVoucherApplied && $scope.voucherApplied.normalVoucherApplied.voucherId === voucher.voucherId) {
            $scope.voucherApplied.normalVoucherApplied = null;
        } else if ($scope.voucherApplied.shippingVoucherApplied && $scope.voucherApplied.shippingVoucherApplied.voucherId === voucher.voucherId) {
            $scope.voucherApplied.shippingVoucherApplied = null;
        } else if ($scope.voucherApplied.paymentVoucherApplied && $scope.voucherApplied.paymentVoucherApplied.voucherId === voucher.voucherId) {
            $scope.voucherApplied.paymentVoucherApplied = null;
        }
        console.log($scope.voucherApplied);
    }


    //----------------------------------------------------------------

    $scope.$watch('listNormalVouchers', function (newListCart, oldListCart) {
        $scope.listNormalVouchers.sort(function (a, b) {
            if (a.moreAmount <= 0 && b.moreAmount > 0) {
                return -1;
            } else if (a.moreAmount > 0 && b.moreAmount <= 0) {
                return 1;
            }

            if (a.maximumDiscountAmount > b.maximumDiscountAmount) {
                return -1;
            } else if (a.maximumDiscountAmount < b.maximumDiscountAmount) {
                return 1;
            }

            if (a.minimumPurchaseAmount < b.minimumPurchaseAmount) {
                return -1;
            } else if (a.minimumPurchaseAmount > b.minimumPurchaseAmount) {
                return 1;
            }

            if (a.discountAmount > b.discountAmount) {
                return -1;
            } else if (a.discountAmount < b.discountAmount) {
                return 1;
            }

            return 0;
        });

    }, true);

    $scope.$watch('listShippingVouchers', function (newListCart, oldListCart) {
        $scope.listShippingVouchers.sort(function (a, b) {
            if (a.moreAmount <= 0 && b.moreAmount > 0) {
                return -1;
            } else if (a.moreAmount > 0 && b.moreAmount <= 0) {
                return 1;
            }

            if (a.maximumDiscountAmount > b.maximumDiscountAmount) {
                return -1;
            } else if (a.maximumDiscountAmount < b.maximumDiscountAmount) {
                return 1;
            }

            if (a.minimumPurchaseAmount < b.minimumPurchaseAmount) {
                return -1;
            } else if (a.minimumPurchaseAmount > b.minimumPurchaseAmount) {
                return 1;
            }

            if (a.discountAmount > b.discountAmount) {
                return -1;
            } else if (a.discountAmount < b.discountAmount) {
                return 1;
            }

            return 0;
        });

    }, true);

    $scope.$watch('listPaymentVouchers', function (newListCart, oldListCart) {
        $scope.listPaymentVouchers.sort(function (a, b) {
            if (a.moreAmount <= 0 && b.moreAmount > 0) {
                return -1;
            } else if (a.moreAmount > 0 && b.moreAmount <= 0) {
                return 1;
            }

            if (a.maximumDiscountAmount > b.maximumDiscountAmount) {
                return -1;
            } else if (a.maximumDiscountAmount < b.maximumDiscountAmount) {
                return 1;
            }

            if (a.minimumPurchaseAmount < b.minimumPurchaseAmount) {
                return -1;
            } else if (a.minimumPurchaseAmount > b.minimumPurchaseAmount) {
                return 1;
            }

            if (a.discountAmount > b.discountAmount) {
                return -1;
            } else if (a.discountAmount < b.discountAmount) {
                return 1;
            }

            return 0;
        });

    }, true);
    //--------------------------------------------
    $scope.openEventCartPopup = function () {
        angular.element(document.querySelector('.background-popup')).addClass('background-behind-popup');
        var popup = angular.element(document.querySelector('#popup-loading-event-cart'));
        popup.css('display', 'block');
    };

    $scope.closeEventCartPopup = function () {
        var popup = angular.element(document.querySelector('#popup-loading-event-cart'));
        popup.css('display', 'none');
        angular.element(document.querySelector('.background-popup')).removeClass('background-behind-popup');
    };
    //--------------------------------------------
    $scope.showVoucherDetail = function (voucher) {
        $scope.vDetail = voucher;
        $scope.openEventCartPopup();

        angular.element(document.querySelector('#popup-loading-event-cart')).addClass('popup-loading-event-cart_hasbottom');

        var popup = angular.element(document.querySelector('#popup-loading-event-cart .popup-loading-event-cart-info'));
        popup.css('display', 'none');

        var popupDetail = angular.element(document.querySelector('#popup-loading-event-cart .popup-loading-event-cart-detail'));
        popupDetail.css('display', 'block');

        var popupDetail = angular.element(document.querySelector('#popup-loading-event-cart .popup-loading-event-cart-bottom'));
        popupDetail.css('display', 'block');
    }

    $scope.closeVoucherDetail = function () {
        angular.element(document.querySelector('#popup-loading-event-cart')).removeClass('popup-loading-event-cart_hasbottom');

        var popup = angular.element(document.querySelector('#popup-loading-event-cart .popup-loading-event-cart-info'));
        popup.css('display', 'block');

        var popupDetail = angular.element(document.querySelector('#popup-loading-event-cart .popup-loading-event-cart-detail'));
        popupDetail.css('display', 'none');

        var popupDetail = angular.element(document.querySelector('#popup-loading-event-cart .popup-loading-event-cart-bottom'));
        popupDetail.css('display', 'none');

        $scope.closeEventCartPopup();
    }

    $scope.backPopupVoucher = function () {
        $scope.closeVoucherDetail();
        $scope.openEventCartPopup();

    }
    //--------------------------------------------

    $scope.viewMoreNormalVouchers = function () {
        $scope.numViewNormalVouchers = $scope.listNormalVouchers.length;
    }

    $scope.viewMoreShippingVouchers = function () {
        $scope.numViewShippingVouchers = $scope.listShippingVouchers.length;
    }

    $scope.viewMorePaymentVouchers = function () {
        $scope.numViewPaymentVouchers = $scope.listPaymentVouchers.length;
    }

    $scope.viewLessNormalVouchers = function () {
        $scope.numViewNormalVouchers = 2;
    }

    $scope.viewLessShippingVouchers = function () {
        $scope.numViewShippingVouchers = 2;
    }

    $scope.viewLessPaymentVouchers = function () {
        $scope.numViewPaymentVouchers = 2;
    }
    //==============================================================================================
    //==============================================================================================

    $scope.splitString = function (string, keySplit) {
        if (string && keySplit) {
            return string.split(keySplit);
        } else {
            return null;
        }
    }

    $scope.getNameTypeOfVoucher = function (voucher) {
        if ($scope.listNormalVouchers.includes(voucher)) {
            return "MÃ GIẢM GIÁ";
        } else if ($scope.listShippingVouchers.includes(voucher)) {
            return "MÃ VẬN CHUYỂN";
        } else if ($scope.listPaymentVouchers.includes(voucher)) {
            return "ƯU ĐÃI THANH TOÁN";
        } else {
            return "";
        }
    }

    function init() {
        getCart();
        getProductCategory();
        getVoucherByUsername(username);
    }


    init();
}