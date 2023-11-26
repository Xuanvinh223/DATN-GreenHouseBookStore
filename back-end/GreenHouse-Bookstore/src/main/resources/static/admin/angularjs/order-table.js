app.controller("OrderController", function ($scope, $http, $interval) {

    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản lý đơn hàng');
    });

    let host = "http://localhost:8081/rest/order";
    $scope.username = localStorage.getItem("username");
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

    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    $scope.currentPage = 1;
    // Đây là biến invoice đã được khởi tạo và có thể sử dụng trong AngularJS
    // $scope.totalItems = $scope.listOrders.length;

    $scope.getData = function () {
        var url = `${host}/getData`;
        return $http.get(url).then((resp) => {
            $scope.originalOrdersList = resp.data.listOrders;
            $scope.listOrders = $scope.originalOrdersList;
            $scope.listProductDetails = resp.data.productDetails;
            $scope.listAuthorities = resp.data.authorities;

            $scope.listOrders.sort(function (a, b) {
                return new Date(b.create_Date) - new Date(a.create_Date);
            });
            // $scope.totalItems = $scope.listOrders.length;
            console.log("List order status: ", $scope.listOrders);
            console.log("List product detail", $scope.listProductDetails);
            console.log("List authorities: ", $scope.listAuthorities);
            console.log("Lenght", $scope.listOrders.length);
            $scope.countAllOrders = $scope.listOrders.length;
            $scope.setListOrderByStatus('All');
            $scope.totalItems = $scope.listOrders.length;
        }).catch((Error) => {
            console.log("Error: ", Error);
        });
    }

    $scope.countOrderByStatus = function (statusID) {
        var count = 0;
        angular.forEach($scope.listOrders, function (order) {
            if (order.status === statusID) {
                count++;
            }
        });
        return count;
    };


    $scope.getNumOfPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.calculateRange = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + 1;
        var endIndex = $scope.currentPage * $scope.itemsPerPage;

        if (endIndex > $scope.totalItems) {
            endIndex = $scope.totalItems;
        }

        return startIndex + ' đến ' + endIndex + ' trên tổng số ' + $scope.totalItems + ' mục';
    };

    $scope.currentStatus = 'All';

    $scope.setListOrderByStatus = function (statusId) {
        $scope.selectedStatus = statusId;
        $scope.currentStatus = statusId;

        if (statusId === 'All') {
            $scope.filteredOrders = $scope.listOrders;
        } else {
            $scope.filteredOrders = $scope.listOrders.filter(function (item) {
                return item.status === statusId;
            });
        }
        $scope.totalItems = $scope.filteredOrders.length;
        // Gọi hàm tìm kiếm lại khi chuyển tab
        // $scope.searchData();
    };

    $scope.searchData = function () {
        if ($scope.currentStatus === 'All') {
            $scope.filteredOrders = $scope.originalOrdersList.filter(function (item) {
                return (
                    item.orderCode.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                    item.username.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                    item.create_Date.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                    item.toPhone.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                    item.toAddress.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                    item.codAmount.toString().includes($scope.searchText)
                );
            });
            $scope.totalItems = $scope.searchText ? $scope.filteredOrders.length : $scope.originalOrdersList.length;

        } else {
            $scope.filteredOrders = $scope.listOrders.filter(function (item) {
                return (
                    item.status === $scope.currentStatus &&
                    (
                        item.orderCode.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                        item.username.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                        item.create_Date.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                        item.fromPhone.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                        item.fromAddress.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                        item.codAmount.toString().includes($scope.searchText)
                    )
                );
            });
            $scope.totalItems = $scope.searchText ? $scope.filteredOrders.length : $scope.listOrders.length;
        }
        $scope.setPage(1);
    };

    // ====================LẤY HÓA ĐƠN CHI TIẾT===============//
    $scope.selectedOrder = [];
    $scope.selectedOrderDetails = [];
    $scope.getOrderInfo = function (orderCode) {
        var url = `${host}/getOrderInfo/${orderCode}`;
        $http.get(url).then(function (resp) {
            var data = resp.data;
            console.log(resp.data);
            // Kiểm tra nếu có thông tin đơn hàng
            if (data.order) {
                $scope.selectedOrder = data.order;
                // Kiểm tra nếu có thông tin đơn hàng chi tiết
                if (data.orderDetails && data.orderDetails.length > 0) {
                    $scope.selectedOrderDetails = data.orderDetails;
                    $scope.calculateTotalOrderAmount();
                } else {
                    // Nếu không có thông tin đơn hàng chi tiết
                    $scope.selectedOrderDetails = [];
                }
            } else {
                // Hiển thị thông báo hoặc xử lý khi không có thông tin đơn hàng
                console.log('Không có thông tin đơn hàng.');
            }
        }).catch(function (error) {
            console.log("Error: ", error);
        });
    };
    //Tính tổng tiền
    $scope.totalOrderAmount = 0;
    $scope.calculateTotalOrderAmount = function () {
        $scope.totalOrderAmount = 0;
        angular.forEach($scope.selectedOrderDetails, function (detail) {
            $scope.totalOrderAmount += detail.price * detail.quantity;
        });
    };

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

    //SOrt
    $scope.reverseSort = false; // Sắp xếp tăng dần
    $scope.sortBy = function (field) {
        if ($scope.sortField === field) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortField = field;
            $scope.reverseSort = false;
        }
    };
    //Hàm hủy

    $scope.cacelOrder = [];
    $scope.showCancelModal = function (item) {
        $scope.cacelOrder.orderCode = item.orderCode;
        $scope.cacelOrder.email = item.account.email;
        $scope.cacelOrder.username = item.account.username;
        $scope.cacelOrder.noteCancel = "";
        $scope.cacelOrder.status = item.status;
        $scope.errorsNoteCancel = "";
    };

    $scope.confirmCancel = function () {
        if ($scope.cacelOrder.noteCancel == null || $scope.cacelOrder.noteCancel.length < 10) {
            $scope.errorsNoteCancel = 'Vui lòng nhập lí do không ít hơn 10 kí tự!';
        }
        else {
            var updatedOrder = {
                status: 'Canceled',
                confirmed_By: $scope.username,
                note: $scope.cacelOrder.noteCancel
            };

            if ($scope.cacelOrder.status === 'Pending Handover') {
                // Nếu đơn hàng ở trạng thái 'Pending Handover', thực hiện cuộc gọi API của Giao Hàng Nhanh
                var ghnApiData = {
                    order_codes: [$scope.cacelOrder.orderCode]
                };

                $http.post('https://online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel', ghnApiData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'ShopId': '4586990',
                        'Token': '7a77199f-6293-11ee-af43-6ead57e9219a'
                    }
                }).then(function (ghnResponse) {
                    // Xử lý phản hồi từ Giao Hàng Nhanh (nếu cần)
                    console.log('GHN API Response:', ghnResponse.data);
                }).catch(function (ghnError) {
                    // Xử lý lỗi từ Giao Hàng Nhanh (nếu cần)
                    console.error('GHN API Error:', ghnError.data);
                });
            }

            // Gọi API để hủy đơn hàng
            $http.put('/rest/order/cancelOrder/' + $scope.cacelOrder.orderCode, updatedOrder)
                .then(function (response) {
                    // Xử lý khi hủy đơn hàng thành công
                    console.log(response.data);
                    $scope.sendNotification("Thông báo hủy đơn hàng", $scope.cacelOrder.orderCode, $scope.cacelOrder.username, "Lí do hủy đơn hàng: " + $scope.cacelOrder.noteCancel);
                    $scope.getData();
                    $scope.clearCacel();
                    $('#order-cancel').modal('hide');
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Hủy đơn hàng ${$scope.cacelOrder.orderCode} thành công`,
                    });
                })
                .catch(function (error) {
                    // Xử lý khi có lỗi xảy ra
                    console.error("Lỗi khi hủy đơn hàng:", error.data);
                });
        }

    };

    $scope.clearCacel = function () {
        $scope.customerEmail = "";
        $scope.noteCancel = "";
        $scope.errorsNoteCancel = "";

    };
    ////////=================WEBSOCKET NOTIFICATION==============///////

    // WEbsocket
    $scope.notifications = [];

    var socket = new SockJS('/notify');
    var stompClient = Stomp.over(socket);

    // $scope.username1 = '114069353350424347080';

    // Kết nối đến WebSocket
    stompClient.connect({}, function (frame) {
        console.log("Admin Connected: " + frame);

        // Hàm để gửi thông báo
        $scope.sendNotification = function (title, orderCode, username, message) {
            var notification = {
                username: { username: username },
                title: title + " (" + orderCode + ")",
                message: message,
                createAt: new Date()
            };

            // Gửi thông báo đến phía server
            stompClient.send("/app/notify/" + username, {}, JSON.stringify(notification));
        };
    });


    // END WEBSOCKET

    $scope.init = function () {
        $scope.getData();
    }

    $scope.init();

});










// $scope.invoice = {
//     invoiceId: 0,
//     username: null,
//     createDate: new Date(),
//     quantity: 0,
//     totalAmount: 0.0,
//     shippingMethod: '',
//     shippingFee: 0.0,
//     paymentAmount: 0.0,
//     paymentMethod: '',
//     bankCode: '',
//     paymentDate: new Date(),
//     receiverName: '',
//     receiverPhone: '',
//     receiverAddress: ''
// };
// NO NAME - END =))

//  // SEARCH PRODUCT -- START

//  $scope.searchProduct = function (keyword) {
//     $scope.searchProductResults = [];
//     if (keyword) {
//         keyword = keyword.toLowerCase();
//         $scope.searchProductResults = $scope.listProductDetails.filter(function (productD) {
//             return productD.product.productName.toLowerCase().includes(keyword);
//         });
//     } else {
//         $scope.searchProductKeyword = null;
//     }
// };


// $scope.selectedProduct = function (product) {
//     var existingProduct = $scope.selectedProducts.find(function (p) {
//         return p.productDetailId.productDetailId === product.productDetailId;
//     });

//     if (existingProduct) {
//         existingProduct.quantity++;
//         existingProduct.amount = existingProduct.quantity * existingProduct.price;
//     } else {
//         var cart = {
//             productDetailId: product,
//             quantity: 1,
//             price: product.price,
//             amount: product.price,
//         };
//         $scope.selectedProducts.push(cart);
//     }

//     $scope.updateInvoice();
//     console.log("Sản phẩm đã chọn: ", $scope.selectedProducts);
//     $scope.searchProduct(null);
// };


// $scope.increaseQuantityProduct = function (item) {
//     if (item.quantity < item.productDetailId.quantityInStock) {
//         item.quantity++;
//         $scope.updateCartItemAmount(item);
//         $scope.updateInvoice();
//     }
// }

// $scope.decreaseQuantityProduct = function (item) {
//     if (item.quantity > 1) {
//         item.quantity--;
//         $scope.updateCartItemAmount(item);
//         $scope.updateInvoice();
//     }
// }

// $scope.validateQuantity = function (item) {
//     if (isNaN(item.quantity) || item.quantity < 0 || item.quantity > item.productDetailId.quantityInStock) {
//         item.quantity = 1;
//     }
//     $scope.updateCartItemAmount(item);
//     $scope.updateInvoice();
// };

// $scope.updateCartItemAmount = function (item) {
//     item.amount = item.price * item.quantity;
// }

// $scope.deleteCartItem = function (item) {
//     var index = $scope.selectedProducts.findIndex(function (e) {
//         return e.productDetailId.productDetailId === item.productDetailId.productDetailId
//     })
//     $scope.selectedProducts.splice(index, 1);
// }

// // SEARCH PRODUCT -- END
// // SEARCH USER -- START

// $scope.searchUser = function (keyword) {
//     $scope.searchUserResults = [];
//     if (keyword) {
//         keyword = keyword.toLowerCase();
//         $scope.listCustomer.forEach(function (customer) {
//             if (customer.username.toLowerCase().includes(keyword)) {
//                 $scope.searchUserResults.push(customer);
//             }
//         });
//     } else {
//         $scope.searchUserKeyword = null;
//     }
// }

// $scope.selectedUser = function (user) {
//     $scope.selectedUsers = user;
//     $scope.searchUser(null);
// }

// $scope.resetSelectedUser = function () {
//     $scope.selectedUsers = null;
//     $scope.searchUser(null);
// }

// // SEARCH USER -- END

// // INVOICE -- START

// $scope.updateQuantityItemInInvoices = function () {
//     $scope.invoice.quantity = 0;
//     $scope.selectedProducts.forEach(function (c) {
//         $scope.invoice.quantity += parseInt(c.quantity);
//     });
// }

// $scope.updateTotalAmountInvoice = function () {
//     $scope.invoice.totalAmount = 0;
//     $scope.selectedProducts.forEach(function (c) {
//         $scope.invoice.totalAmount += parseInt(c.amount);
//     });
// }

// $scope.updateShippingFeeInvoice = function () {

// }

// $scope.updatePaymentAmountInvoice = function () {
//     $scope.invoice.paymentAmount = $scope.invoice.totalAmount + $scope.invoice.shippingFee;

// }

// $scope.updateInvoice = function () {
//     $scope.updateQuantityItemInInvoices();
//     $scope.updateTotalAmountInvoice();
//     $scope.updateShippingFeeInvoice();
//     $scope.updatePaymentAmountInvoice();
// }

// // INVOICE -- END