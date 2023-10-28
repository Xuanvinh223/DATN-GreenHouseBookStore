app.controller("productDetailController", function ($scope, $routeParams, $http, jwtHelper, ProductDetailService) {
    let host = "http://localhost:8081/customer/rest/product-detail";
    var token = localStorage.getItem('token');
    if (token) {
        var decodedToken = jwtHelper.decodeToken(token);
        $scope.username = decodedToken.sub;
        console.log($scope.username);
    }
    // Trong trang product-details
    var params = new URLSearchParams(location.search);
    var productDetailId = params.get('id');
    //Phân trang
    $scope.currentPage = 1;
    // Khởi tạo hàm scope
    $scope.authenticPhotosForReview = {};
    $scope.listProductReviews = [];
    $scope.productDetail = [];
    $scope.productImages = [];
    $scope.getProductDetail = function () {
        ProductDetailService.getProductDetailById(productDetailId)
            .then(function (response) {
                $scope.productDetail = response.data.productDetail;
                $scope.productImages = response.data.productImages;
                $scope.listProductReviews = response.data.productReviews;
                console.log('Dữ liệu Sản Phẩm đã được trả về:', $scope.productDetail);
                console.log('Dữ liệu Hình ảnh đã được trả về:', $scope.productImages);
                console.log('Dữ liệu SP TƯƠNG TỰ đã được trả về:', $scope.productImages);
                console.log("Danh sách đánh giá sản phẩm: ", $scope.listProductReviews);
                angular.forEach($scope.listProductReviews, function (review) {
                    $scope.getAuthenticPhotosForReview(review.reviewId);
                });
            })
            .catch(function (error) {
                console.log('Lỗi khi lấy chi tiết sản phẩm: ' + error);
            });
    };

    $scope.getRatingPercentage = function (starRating) {
       
        var ratingCount = $scope.listProductReviews.filter(function (review) {
            return review.star === starRating;
        }).length;

        var totalReviews = $scope.listProductReviews.length;

        // Tính tỷ lệ
        if (totalReviews > 0) {
            return (ratingCount / totalReviews) * 100;
        } else {
            return 0;
        }
    };
    $scope.numStar = [1, 2, 3, 4, 5];
    //tính số sao của 1 sản phẩm
    $scope.calculateAverageRating = function () {
        var totalRatings = 0;
        var totalReviews = $scope.listProductReviews.length;

        if (totalReviews === 0) {
            return 0; // Tránh chia cho 0
        }

        // Tính tổng số sao từ tất cả đánh giá
        for (var i = 0; i < totalReviews; i++) {
            totalRatings += $scope.listProductReviews[i].star;
        }

        // Tính trung bình số sao
        var avgRating = (totalRatings / totalReviews).toFixed(1);
        return Math.round(avgRating);
    };


    $scope.getAuthenticPhotosForReview = function (reviewId) {
        // Gọi REST endpoint để lấy danh sách ảnh chi tiết
        $http.get(`${host}/reviews/${reviewId}`)
            .then(function (response) {
                // Gán danh sách ảnh chi tiết vào biến $scope cho mỗi bình luận
                $scope.authenticPhotosForReview[reviewId] = response.data;
                console.log("Ảnh Review", response.data);
            })
            .catch(function (error) {
                console.log('Lỗi khi lấy ảnh chi tiết: ' + error);
            });
    };
    $scope.showFullDescription = false;
    $scope.wordsPerLine = 25; // Số từ trung bình trên mỗi dòng (tuỳ chỉnh)

    $scope.toggleDescription = function () {
        $scope.showFullDescription = !$scope.showFullDescription;
    };

    $scope.getLimitedDescription = function () {
        if ($scope.productDetail.product.description) {
            var description = $scope.productDetail.product.description;

            var words = description.split(" "); // Tách văn bản thành từng từ
            var lines = [];

            if (!$scope.showFullDescription) {
                var currentLine = "";
                var currentWordIndex = 0;

                while (currentWordIndex < words.length) {
                    currentLine += words[currentWordIndex] + " ";
                    currentWordIndex++;

                    if (currentWordIndex % $scope.wordsPerLine === 0) {
                        lines.push(currentLine);
                        currentLine = "";
                    }
                }

                // Gộp từng dòng lại
                var limitedDescription = lines.slice(0, 3).join("\n"); // Chỉ hiển thị tối đa 3 dòng

                return limitedDescription;
            }

            return description;
        } else {
            return '';
        }

    };


    // Thêm biến selectedImages để lưu trữ các ảnh đã chọn

    $scope.saveReview = {
        comment: '',
        star: 1
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
            productDetail: { productDetailId: productDetailId },
            comment: $scope.saveReview.comment,
            date: currentDate,
            star: $scope.saveReview.star
        };

        var url = `${host}/reviews`;

        $http.post(url, reviewData)
            .then(function (response) {
                console.log("Đánh giá đã được lưu:", response.data);


                var reviewId = response.data.reviewId;
                var url1 = `${host}/reviews/${reviewId}/images`;
                // Lưu hình ảnh lên server và cập nhật URL thật của hình ảnh
                for (var i = 0; i < $scope.selectedImages.length; i++) {
                    (function (index) {
                        var file = $scope.selectedImages[index].file;
                        var formData = new FormData();
                        formData.append('file', file);

                        $http.post(url1, formData, {
                            transformRequest: angular.identity,
                            headers: { "Content-Type": undefined }
                        })
                            .then(function (response) {
                                // Cập nhật URL thật của hình ảnh sau khi lưu thành công
                                if ($scope.selectedImages[index]) {
                                    var imageUrl = response.data.imageUrl;
                                    $scope.selectedImages[index].url = imageUrl;
                                }
                            })
                            .catch(function (error) {
                                console.log("Lỗi khi lưu hình ảnh: " + error);
                            });
                    })(i);
                }
                $scope.getProductDetail();
                $scope.closeReview();
            })
            .catch(function (error) {
                console.log("Lỗi khi lưu đánh giá: " + error);
            });
    };

    // Gọi hàm để lấy thông tin sản phẩm và tạo các slide
    $scope.getProductDetail();
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

    $scope.closeReview = function () {
        $scope.clearReview();
        // Đóng modal
        $('#popup_write_review').modal('hide');
    };

    $scope.clearReview = function () {
        $scope.saveReview.comment = '';
        $scope.saveReview.star = 1;
        $scope.selectedImages = [];
        $scope.errors = {};
    };


});



//Ảnh
// var urlImgs = "http://localhost:8081/customer/uploadmulti/products";

// $scope.urldt = function (filename) {
//     if (filename != null) {
//         console.log(filename);
//         return `http://localhost:8081/customer/images/products/${filename}`;
//     } else {
//         return 'asset/images/default.jpg';
//     }
// }
// $scope.imgdt = [];
// var urlImgs = "http://localhost:8081/customer/uploadmulti/images/products";

// $scope.imgdt = [];

// $scope.imgdts = function (files) {
//     var formDatas = [];
//     for (var i = 0; i < files.length; i++) {
//         var form = new FormData();
//         form.append("files", files[i]);
//         formDatas.push(form);
//     }

//     formDatas.forEach(function (formData) {
//         $http.post(urlImgs, formData, {
//             transformRequest: angular.identity,
//             headers: { 'Content-Type': undefined }
//         }).then(function (resp) {
//             if (Array.isArray(resp.data) && resp.data.length > 0) {
//                 $scope.imgdt.push(...resp.data); // Thêm hình ảnh vào mảng imgdt
//                 console.log("Success", resp.data);
//             } else {
//                 console.log("Phản hồi không chứa dữ liệu hình ảnh.");
//             }
//         }).catch(function (error) {
//             console.log("Lỗi khi gửi yêu cầu POST: " + error);
//         });
//     });
// }


// $scope.deleteImage = function (imageName) {
//     var index = -1;
//     for (var i = 0; i < $scope.imgdt.length; i++) {
//         if ($scope.imgdt[i].name === imageName) {
//             index = i;
//             break;
//         }
//     }

//     if (index !== -1) {
//         $scope.imgdt.splice(index, 1);
//         console.log("Delete success");
//     }
// };
