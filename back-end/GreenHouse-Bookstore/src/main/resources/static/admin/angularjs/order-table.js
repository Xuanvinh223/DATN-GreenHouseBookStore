app.controller("OrderController", function ($scope, $http, $interval) {

    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản lý đơn hàng');
    });

    let host = "http://localhost:8081/rest/order";

    // List get data - start
    $scope.listInvoiceDetails = [];
    $scope.listInvoiceMappingVoucher = [];
    $scope.listOderMappingStatus = [];
    $scope.listProductDetails = [];
    $scope.listAuthorities = [];
    // List get data - end

    // List for repeat - start
    $scope.listOrders = [];
    $scope.listStatus = [];
    $scope.listCustomer = [];
    $scope.searchProductResults = [];
    $scope.selectedProducts = [];
    $scope.searchUserResults = [];
    // List for repeat - start

    // NO NAME - START =))
    $scope.selectedStatus = null;
    $scope.selectedUsers = null;
    $scope.searchProductKeyword = null;
    $scope.searchUserKeyword = null;

    $scope.invoice = {
        invoiceId: 0,
        username: null,
        createDate: new Date(),
        quantity: 0,
        totalAmount: 0.0,
        shippingMethod: '',
        shippingFee: 0.0,
        paymentAmount: 0.0,
        paymentMethod: '',
        bankCode: '',
        paymentDate: new Date(),
        receiverName: '',
        receiverPhone: '',
        receiverAddress: ''
    };
    // NO NAME - END =))

    // Đây là biến invoice đã được khởi tạo và có thể sử dụng trong AngularJS


    $scope.getData = function () {
        var url = `${host}/getData`;

        return $http.get(url).then((resp) => {
            $scope.listInvoiceDetails = resp.data.invoiceDetails;
            $scope.listInvoiceMappingVoucher = resp.data.invoiceMappingVoucher;
            $scope.listOderMappingStatus = resp.data.orderMappingStatus;
            $scope.listOrderStatus = resp.data.orderStatus;
            $scope.listProductDetails = resp.data.productDetails;
            $scope.listAuthorities = resp.data.authorities;

            console.log("List invoice details: ", $scope.listInvoiceDetails);
            console.log("List voucher mapping invoice: ", $scope.listInvoiceMappingVoucher);
            console.log("List order mapping status: ", $scope.listOderMappingStatus);
            console.log("List order status: ", $scope.listOrderStatus);
            console.log("List product detail", $scope.listProductDetails);
            console.log("List authorities: ", $scope.listAuthorities);

            $scope.setListCustomer();
        }).catch((Error) => {
            console.log("Error: ", Error);
        });
    }

    $scope.setListCustomer = function () {
        $scope.listCustomer = [];
        $scope.listAuthorities.filter(function (item) {
            if (item.role.role.toLowerCase() == "customer") {
                $scope.listCustomer.push(item.account);
            }
        })
    };

    $scope.setListOrderByStatus = function (statusId) {
        $scope.selectedStatus = statusId;
        $scope.listOrders = [];
        if ($scope.listOderMappingStatus != null) {
            $scope.listOderMappingStatus.filter(function (item) {
                if (item.status.statusId === statusId) {
                    $scope.listOrders.push(item.order);
                }
            })
        }
    };

    $scope.countOrderByStatusId = function (statusID) {
        var count = 0;
        angular.forEach($scope.listOderMappingStatus, function (statusOrder) {
            if (statusOrder.status.statusId === statusID) {
                count++;
            }
        });
        return count;
    };

    $scope.getListInvoiceDetails = function (invoiceIdTarget) {
        if ($scope.listInvoiceDetails != null) {
            return $scope.listInvoiceDetails.filter(function (item) {
                return item.invoice.invoiceId === invoiceIdTarget;
            })
        }
    }

    $scope.getDiscountAmountByInvoiceID = function (invoiceIdTarget) {
        if ($scope.listInvoiceMappingVoucher != null) {
            var discountAmount = 0;
            $scope.listInvoiceMappingVoucher.forEach(function (item) {
                if (item.invoice.invoiceId === invoiceIdTarget) {
                    discountAmount = item.discountAmount;
                }
            });
            return discountAmount;
        }
        return 0;
    };

    $scope.getOrderStatusByOrderId = function (orderIdTarget) {
        if ($scope.listOderMappingStatus != null) {
            var orderStatus = "";
            $scope.listOderMappingStatus.forEach(function (item) {
                if (item.order.orderId === orderIdTarget) {
                    orderStatus = item.status.name;
                }
            });
            return orderStatus;
        }
    }

    $scope.formatDate = function (date) {
        if (date == null) {
            return "";
        }
        var formattedDate = new Date(date);
        var year = formattedDate.getFullYear();
        var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
        var day = formattedDate.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // SEARCH PRODUCT -- START

    $scope.searchProduct = function (keyword) {
        $scope.searchProductResults = [];
        if (keyword) {
            keyword = keyword.toLowerCase();
            $scope.searchProductResults = $scope.listProductDetails.filter(function (productD) {
                return productD.product.productName.toLowerCase().includes(keyword);
            });
        } else {
            $scope.searchProductKeyword = null;
        }
    };


    $scope.selectedProduct = function (product) {
        var existingProduct = $scope.selectedProducts.find(function (p) {
            return p.productDetailId.productDetailId === product.productDetailId;
        });

        if (existingProduct) {
            existingProduct.quantity++;
            existingProduct.amount = existingProduct.quantity * existingProduct.price;
        } else {
            var cart = {
                productDetailId: product,
                quantity: 1,
                price: product.price,
                amount: product.price,
            };
            $scope.selectedProducts.push(cart);
        }

        $scope.updateInvoice();
        console.log("Sản phẩm đã chọn: ", $scope.selectedProducts);
        $scope.searchProduct(null);
    };


    $scope.increaseQuantityProduct = function (item) {
        if (item.quantity < item.productDetailId.quantityInStock) {
            item.quantity++;
            $scope.updateCartItemAmount(item);
            $scope.updateInvoice();
        }
    }

    $scope.decreaseQuantityProduct = function (item) {
        if (item.quantity > 1) {
            item.quantity--;
            $scope.updateCartItemAmount(item);
            $scope.updateInvoice();
        }
    }

    $scope.validateQuantity = function (item) {
        if (isNaN(item.quantity) || item.quantity < 0 || item.quantity > item.productDetailId.quantityInStock) {
            item.quantity = 1;
        }
        $scope.updateCartItemAmount(item);
        $scope.updateInvoice();
    };

    $scope.updateCartItemAmount = function (item) {
        item.amount = item.price * item.quantity;
    }

    $scope.deleteCartItem = function (item) {
        var index = $scope.selectedProducts.findIndex(function (e) {
            return e.productDetailId.productDetailId === item.productDetailId.productDetailId
        })
        $scope.selectedProducts.splice(index, 1);
    }

    // SEARCH PRODUCT -- END
    // SEARCH USER -- START

    $scope.searchUser = function (keyword) {
        $scope.searchUserResults = [];
        if (keyword) {
            keyword = keyword.toLowerCase();
            $scope.listCustomer.forEach(function (customer) {
                if (customer.username.toLowerCase().includes(keyword)) {
                    $scope.searchUserResults.push(customer);
                }
            });
        } else {
            $scope.searchUserKeyword = null;
        }
    }

    $scope.selectedUser = function (user) {
        $scope.selectedUsers = user;
        $scope.searchUser(null);
    }

    $scope.resetSelectedUser = function () {
        $scope.selectedUsers = null;
        $scope.searchUser(null);
    }

    // SEARCH USER -- END

    // INVOICE -- START

    $scope.updateQuantityItemInInvoices = function () {
        $scope.invoice.quantity = 0;
        $scope.selectedProducts.forEach(function (c) {
            $scope.invoice.quantity += parseInt(c.quantity);
        });
    }

    $scope.updateTotalAmountInvoice = function () {
        $scope.invoice.totalAmount = 0;
        $scope.selectedProducts.forEach(function (c) {
            $scope.invoice.totalAmount += parseInt(c.amount);
        });
    }

    $scope.updateShippingFeeInvoice = function () {

    }

    $scope.updatePaymentAmountInvoice = function () {
        $scope.invoice.paymentAmount = $scope.invoice.totalAmount + $scope.invoice.shippingFee;

    }

    $scope.updateInvoice = function () {
        $scope.updateQuantityItemInInvoices();
        $scope.updateTotalAmountInvoice();
        $scope.updateShippingFeeInvoice();
        $scope.updatePaymentAmountInvoice();
    }

    // INVOICE -- END


    $scope.init = function () {
        $scope.getData().then(function () {
            $scope.setListOrderByStatus(1);
        });
    }


    $scope.init();

});
