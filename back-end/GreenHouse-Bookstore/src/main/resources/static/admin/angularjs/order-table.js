app.controller("OrderController", function ($scope, $http, $interval) {

    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản lý đơn hàng');
    });

    let host = "http://localhost:8081/rest/order";
    $scope.username = localStorage.getItem("username");
    const tokenGHN = '7a77199f-6293-11ee-af43-6ead57e9219a';
    const shopIdGHN = 4586990;
    const provinceCodeGH = 220;
    const districtCodeGH = 1574;
    const wardCodeGH = 550307;
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
        $scope.totalOrderAmount += $scope.selectedOrder.codAmount;
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
    // duyệt đơn
    $scope.acceptOrder = function (order) {
        var apiUrl = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create';
        //================================================================
        var paymentTypeId = order.paymentTypeId;
        var note = order.note;
        var requiredNote = order.requiredNote;
        var fromName = order.fromName;
        var fromPhone = order.fromPhone;
        var fromAddress = order.fromAddress;
        var fromWardName = order.fromWardName;
        var fromDistrictName = order.fromDistrictName;
        var fromProvinceName = order.fromProvinceName;
        var returnPhone = order.returnPhone;
        var returnAddress = order.returnAddress;
        var returnDistrictId = order.returnDistrictId;
        var returnWardCode = order.returnWardCode;
        var clientOrderCode = order.clientOrderCode;
        var toName = order.toName;
        var toPhone = order.toPhone;
        var toAddress = order.toAddress;
        var toWardCode = order.toWardCode;
        var toDistrictId = order.toDistrictId;
        var codAmount = order.codAmount;
        var content = order.content;
        var weight = order.weight;
        var length = order.length;
        var width = order.width;
        var height = order.height;
        var insuranceValue = order.insuranceValue;
        var serviceId = order.serviceId;
        var serviceTypeId = order.serviceTypeId;
        var items = [];
        angular.forEach($scope.selectedOrderDetails, orderDetail => {
            var item = {
                name: orderDetail.productName,
                code: orderDetail.productDetail.product.productId,
                quantity: orderDetail.quantity,
                price: orderDetail.price,
                length: orderDetail.length,
                width: orderDetail.width,
                height: orderDetail.height,
                weight: orderDetail.weight,
            }
            items.push(item);
        })
        //================================================
        var requestBody = {
            payment_type_id: paymentTypeId,
            note: note,
            required_note: requiredNote,
            from_name: fromName,
            from_phone: fromPhone,
            from_address: fromAddress,
            from_ward_name: fromWardName,
            from_district_name: fromDistrictName,
            from_province_name: fromProvinceName,
            return_phone: returnPhone,
            return_address: returnAddress,
            return_district_id: returnDistrictId,
            return_ward_code: returnWardCode,
            client_order_code: clientOrderCode,
            to_name: toName,
            to_phone: toPhone,
            to_address: toAddress,
            to_ward_code: toWardCode,
            to_district_id: toDistrictId,
            cod_amount: codAmount,
            content: content,
            weight: weight,
            length: length,
            width: width,
            height: height,
            insurance_value: insuranceValue,
            service_id: serviceId,
            service_type_id: serviceTypeId,
            items: items
        };


        var requestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'ShopId': shopIdGHN,
                'Token': tokenGHN
            }
        };

        $http.post(apiUrl, requestBody, requestConfig)
            .then(function (response) {
                $scope.getData();
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
        var updatedOrder = {
            status: 'pending',
            confirmed_By: $scope.username,
            note: 'Đơn hàng của bạn đã được GreenHouse xác nhận!'
        };
        $http.put('/rest/order/cancelOrder/' + order.orderCode, updatedOrder)
            .then(function (response) {
                // Xử lý khi hủy đơn hàng thành công
                console.log(response.data);
                loadingOverlay.style.display = "none";
                $scope.sendNotification("Thông báo giao hàng", order.orderCode, order.username, "Đơn hàng của bạn đã được GreenHouse xác nhận ");
                $scope.getData();
                $scope.clearCancel();

                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: `Xác nhận đơn hàng thành công`,
                });
            })
            .catch(function (error) {
                // Xử lý khi có lỗi xảy ra
                console.error("Lỗi khi hủy đơn hàng:", error.data);
            });
    };

    //Hàm hủy
    $scope.cancelOrder = [];
    $scope.showCancelModal = function (item) {
        $scope.cancelOrder.orderCode = item.orderCode;
        $scope.cancelOrder.email = item.account.email;
        $scope.cancelOrder.username = item.account.username;
        $scope.cancelOrder.noteCancel = "";
        $scope.cancelOrder.status = item.status;
        $scope.errorsNoteCancel = "";
    };

    $scope.confirmCancel = function () {
        if ($scope.cancelOrder.noteCancel == null || $scope.cancelOrder.noteCancel.length < 10) {
            $scope.errorsNoteCancel = 'Vui lòng nhập lí do không ít hơn 10 kí tự!';
        }
        else {
            var loadingOverlay = document.getElementById("loadingOverlay");
            loadingOverlay.style.display = "block";
            var updatedOrder = {
                status: 'cancel',
                confirmed_By: $scope.username,
                note: $scope.cancelOrder.noteCancel
            };

            if ($scope.cancelOrder.status === 'pending') {
                // Nếu đơn hàng ở trạng thái 'pending', thực hiện cuộc gọi API của Giao Hàng Nhanh
                var ghnApiData = {
                    order_codes: [$scope.cancelOrder.orderCode]
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
            $http.put('/rest/order/cancelOrder/' + $scope.cancelOrder.orderCode, updatedOrder)
                .then(function (response) {
                    // Xử lý khi hủy đơn hàng thành công
                    $('#order-cancel').modal('hide');
                    console.log(response.data);
                    loadingOverlay.style.display = "none";
                    $scope.sendNotification("Thông báo hủy đơn hàng", $scope.cancelOrder.orderCode, $scope.cancelOrder.username, "Lí do hủy đơn hàng: " + $scope.cancelOrder.noteCancel);
                    $scope.getData();
                    $scope.clearCancel();

                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Hủy đơn hàng ${$scope.cancelOrder.orderCode} thành công`,
                    });
                })
                .catch(function (error) {
                    // Xử lý khi có lỗi xảy ra
                    console.error("Lỗi khi hủy đơn hàng:", error.data);
                });
        }

    };

    $scope.clearCancel = function () {
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