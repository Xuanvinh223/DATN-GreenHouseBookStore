app.controller("OrderDetailController", function ($scope, $timeout, $routeParams, $http, jwtHelper) {
    let host = "http://localhost:8081/customer/rest/order";
    var token = localStorage.getItem('token');

    if (token) {
        var decodedToken = jwtHelper.decodeToken(token);
        $scope.username = decodedToken.sub;
        $scope.listOrders = [];
        $scope.listOrderDetails = {};
        $scope.filteredOrders = [];
        $scope.currentStatus = 'All';

        // Hàm để lấy danh sách order
        $scope.getOrders = function () {
            $http.get(host + '/' + $scope.username)
                .then(function (response) {
                    $scope.listOrders = response.data.orders;

                    // Gọi hàm để lấy danh sách order details dựa trên danh sách order
                    $scope.listOrders.forEach(function (order) {
                        $scope.getOrderDetails(order.orderCode);
                    });

                    // Mặc định hiển thị tất cả đơn hàng
                    $scope.setListOrderByStatus('All');
                })
                .catch(function (error) {
                    console.error('Error fetching orders:', error);
                });
        };

        $scope.getOrderDetails = async function (orderCode) {
            try {
                const response = await $http.get(host + '/orderdetail/' + orderCode);
                $scope.listOrderDetails[orderCode] = response.data;
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        // Hàm xử lý sự kiện khi người dùng chọn trạng thái từ thanh tab
        $scope.selectStatus = function (status) {
            $scope.setListOrderByStatus(status);
        };
        // Trong controller của bạn
        $scope.hasOrders = false;

        // Hàm để lọc danh sách đơn hàng theo trạng thái đã chọn
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

            // Kiểm tra xem có đơn hàng hay không
            $scope.hasOrders = $scope.filteredOrders.length > 0;
        };
        $scope.shouldShowOrder = function (order) {
            const excludedStatuses = ['Returning', 'Pending Redelivery Confirmation', 'Lost/Damaged Goods'];
            return excludedStatuses.indexOf(order.status) === -1;
        };


        //Hủy đơn hàng
        $scope.cacelOrder = [];
        $scope.showCancelModal = function (item) {
            $('#order-cancel').modal('show');
            $scope.cacelOrder.orderCode = item.orderCode;
            $scope.cacelOrder.username = item.account.username;
            $scope.cacelOrder.noteCancel = "";
            $scope.cacelOrder.status = item.status;
            $scope.errorsNoteCancel = "";
        };

        $scope.confirmCancel = function () {
            if ($scope.cacelOrder.noteCancel == null || $scope.cacelOrder.noteCancel.length < 10) {
                $scope.errorsNoteCancel = 'Vui lòng nhập lí do không ít hơn 10 kí tự!';
            } else {
                var updatedOrder = {
                    status: 'Canceled',
                    confirmed_By: $scope.username,
                    note: $scope.cacelOrder.noteCancel
                };
                var url = `${host}/cancelOrder/`;
                // Gọi API để hủy đơn hàng
                $http.put(url + $scope.cacelOrder.orderCode, updatedOrder)
                    .then(function (response) {
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
        // Mua lại
        $scope.buyAgain = function (orderCode) {
            var listOrderDetails = $scope.listOrderDetails[orderCode];
            
            var addToCartPromises = listOrderDetails.map(function (item) {
                return $scope.addToCart(item.productDetail.productDetailId, 1);
            });
        
            Promise.all(addToCartPromises)
                .then(function () {
                    window.location.href = "/cart";
                })
                .catch(function (error) {
                    console.error("Error adding to cart:", error);
                });
        }
        

        // Thực hiện lấy danh sách đơn hàng khi controller khởi tạo
        $scope.getOrders();
    }
});