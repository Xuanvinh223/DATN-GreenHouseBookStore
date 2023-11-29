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
            } else if (statusId === 'Completed') {
                // Lọc danh sách đơn hàng có trạng thái "Completed" hoặc "Received"
                $scope.filteredOrders = $scope.listOrders.filter(function (item) {
                    return item.status === 'Completed' || item.status === 'Received';
                });
            } else {
                // Lọc theo trạng thái khác
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

                if ($scope.cancelOrder.status === 'Pending Handover') {
                    // Nếu đơn hàng ở trạng thái 'Pending Handover', thực hiện cuộc gọi API của Giao Hàng Nhanh
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



        // ============PHẦN ĐÁNH GIÁ==============//
        $scope.acceptOrderModal = function (orderCode) {
            // Lưu mã đơn hàng vào $scope để sử dụng trong hàm acceptOrder
            $scope.currentOrderCode = orderCode;
            // Mở modal
            $('#acceptOrderModal').modal('show');
        };
        $scope.acceptOrder = function () {
            // Gọi hàm xác nhận đơn hàng với mã đơn hàng hiện tại
            $http.put(`${host}/confirmOrder/${$scope.currentOrderCode}`)
                .then(function (response) {
                    $('#acceptOrderModal').modal('hide');
                    $('#message-order').modal('show');
                    $scope.modalContentOrder = "Xác Nhận Thành Công!";
                    $timeout(function () {
                        $('#message-order').modal('hide');
                    }, 2000);
                })
                .catch(function (error) {
                    console.error('Error confirming order:', error);
                });
        };

        $scope.showModalReview = function (order) {
            // Lưu orderCode vào biến $scope.saveReview để sử dụng trong hàm saveReviewData
            $scope.saveReview.orderCode = order.orderCode;

            // Tạo một promise cho việc lấy chi tiết đơn hàng từ API
            var getOrderDetailPromise = $http.get(host + '/orderdetail/' + order.orderCode);

            getOrderDetailPromise.then(function (response) {
                // Truyền thông tin chi tiết của đơn hàng vào $scope
                $scope.selectedOrderDetails = response.data;

                // Gọi hàm kiểm tra đánh giá cho phần tử đầu tiên trong mảng
                checkReviewStatus(0);

            }).catch(function (error) {
                console.error('Error fetching order details:', error);
            });

            // Hàm kiểm tra đánh giá cho từng phần tử trong mảng
            function checkReviewStatus(index) {
                // Kiểm tra xem đã kiểm tra hết tất cả phần tử trong mảng chưa
                if (index < $scope.selectedOrderDetails.length) {
                    // Lấy thông tin của orderDetail
                    var orderDetail = $scope.selectedOrderDetails[index];

                    // Tạo một promise cho việc kiểm tra trạng thái đánh giá từ API
                    var checkReviewStatusPromise = $http.get(host + '/' + $scope.username + '/' + orderDetail.productDetail.productDetailId + '/' + order.orderCode);

                    checkReviewStatusPromise.then(function (response) {
                        // Kiểm tra trạng thái đánh giá và cập nhật isReviewed
                        orderDetail.isReviewed = response.data.productExists;

                        // Gọi đệ quy cho phần tử tiếp theo trong mảng
                        checkReviewStatus(index + 1);
                    }).catch(function (error) {
                        console.error('Error checking review status:', error);
                    });
                } else {
                    // Kiểm tra xem tất cả các phần tử đã được đánh giá chưa
                    $('#popup_show_review').modal('show');

                }
            }
        };

        $scope.openReviewPopup = function (productDetailId) {
            $scope.productDetailId = productDetailId;
            $('#popup_show_review').modal('hide');
            $('#popup_write_review').modal('show');
        }


        $scope.selectedImages = [];
        // // Hàm xử lý khi người dùng chọn một hoặc nhiều ảnh
        $scope.onImageSelect = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageUrl = URL.createObjectURL(file);
                $scope.$apply(function () {
                    $scope.selectedImages.push({ file: file, url: imageUrl });
                });

            }
            console.log(files);
        };

        // Hàm xử lý khi người dùng xóa một ảnh
        $scope.deleteImage = function (index) {
            // Loại bỏ ảnh khỏi mảng selectedImages
            $scope.selectedImages.splice(index, 1);
        };
        $scope.saveReview = {
            comment: '',
            star: 5
        };
        $scope.errors = {};
        $scope.saveReviewData = function () {
            if (!$scope.saveReview.comment) {
                $scope.errors.comment = '* Vui lòng nhập mô tả về sản phẩm';
                return;
            }

            var currentDate = new Date();
            var username = $scope.username;
            var reviewData = {
                account: { username: username },
                productDetail: { productDetailId: $scope.productDetailId },
                comment: $scope.saveReview.comment,
                date: currentDate,
                star: $scope.saveReview.star,
                order: { orderCode: $scope.saveReview.orderCode } // Thêm orderCode vào reviewData
            };
            let host1 = "http://localhost:8081/customer/rest/product-detail";
            var url = `${host1}/reviews`;

            $http.post(url, reviewData)
                .then(function (response) {
                    console.log("Đánh giá đã được lưu:", response.data);

                    var reviewId = response.data.reviewId;
                    var orderCode = response.data.order;
                    var url1 = `${host1}/reviews/${reviewId}/images`;

                    var imageUploadPromises = [];

                    // Tạo mảng promises cho việc lưu hình ảnh
                    $scope.showLoading();
                    for (var i = 0; i < $scope.selectedImages.length; i++) {
                        (function (index) {
                            var file = $scope.selectedImages[index].file;
                            var formData = new FormData();
                            formData.append('file', file);

                            var imageUploadPromise = $http.post(url1, formData, {
                                transformRequest: angular.identity,
                                headers: { "Content-Type": undefined }
                            });

                            imageUploadPromises.push(imageUploadPromise);
                        })(i);
                    }

                    // Sử dụng Promise.all để đợi cho tất cả các promises hoàn thành
                    Promise.all(imageUploadPromises)
                        .then(function (responses) {
                            // Cập nhật URL thật của hình ảnh sau khi lưu thành công
                            responses.forEach(function (response, index) {
                                var imageUrl = response.data.imageUrl;
                                $scope.selectedImages[index].url = imageUrl;
                            });
                            // Tiếp tục với các hành động tiếp theo
                            $scope.hideLoading();
                            $('#message').modal('show');
                            $scope.modalContentOrder = "Lưu bình luận thành công!";
                            $timeout(function () {
                                $('#message').modal('hide');
                            }, 2000);
                            $scope.getOrders();
                            $scope.closeReview();
                            $scope.showModalReview(orderCode);
                            $('#popup_show_review').modal('show');
                        })
                        .catch(function (error) {
                            console.log("Lỗi khi lưu hình ảnh: " + error);
                        });
                })
                .catch(function (error) {
                    console.log("Lỗi khi lưu đánh giá: " + error);
                });
        };

        $scope.closeReview = function () {
            $scope.clearReview();
            // Đóng modal
            $('#popup_write_review').modal('hide');
        };

        $scope.closeReviewOk = function () {
            $('#popup_show_review').modal('hide');
        }
        $scope.clearReview = function () {
            $scope.saveReview.comment = '';
            $scope.saveReview.star = 5;
            $scope.selectedImages = [];
            $scope.errors = {};
        };
        //=======================================//
        // Thực hiện lấy danh sách đơn hàng khi controller khởi tạo
        $scope.getOrders();
    }
});
// $scope.callRestController = function (username, productDetailId, orderCode) {
//     var url = host + '/' + username + '/' + productDetailId + '/' + orderCode;

//     $http.get(url)
//         .then(function (response) {
//             // Xử lý dữ liệu nhận được từ server
//             var productExists = response.data.productExists;
//             console.log('Product exists:', productExists);

//             // Gọi các hàm khác tùy thuộc vào nhu cầu của bạn
//         })
//         .catch(function (error) {
//             console.error('Error calling RestController:', error);
//         });
// };