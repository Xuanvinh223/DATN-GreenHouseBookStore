app.controller("productPageController", productPageController);

function productPageController($http, $scope, $filter, productPageAPI, CartService, ProductDetailService, $location) {
    const host = productPageAPI;

    //Phân trang
    $scope.currentPage = 1;
    // DECLARE SCOPE GET DATA - START

    $scope.listProductDetail = [];
    $scope.listCategoryTypes = [];
    $scope.listCategories = [];
    $scope.listBookAuthor = [];
    $scope.listProductDiscount = [];
    $scope.listProductReviews = [];
    $scope.listBrands = [];
    $scope.listProductImages = [];

    // DECLARE SCOPE GET DATA - END

    // DECLARE SCOPE FOR UI - START
    $scope.numStar = [1, 2, 3, 4, 5];
    $scope.quickViewProduct = null;
    $scope.listImageQuickView = [];
    // pagination - START
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.maxSize = 5;
    $scope.itemsPerPage = 6;
    // pagination - END

    // DECLARE SCOPE FOR UI - END
    //=================================
    // SCOPE_FUNCTION GET DATA - START


    $scope.getDataProductDetail = function () {
        var url = host + "/product-show";

        // Truy vấn API để lấy dữ liệu
        $http.get(url, {params: {categoryId: $scope.selectedCategoryId}}).then(response => {
            $scope.listProductDetail = response.data.listProductDetail;
            $scope.listCategoryTypes = response.data.listCategoryTypes;
            $scope.listCategories = response.data.listCategories;
            $scope.listBookAuthor = response.data.listBookAuthor;
            $scope.listProductDiscount = response.data.listProductDiscount;
            $scope.listProductReviews = response.data.listProductReviews;
            $scope.listBrands = response.data.listBrands;
            $scope.listProductImages = response.data.listProductImages;
            $scope.listImportInvoiceDetail = response.data.listImportInvoiceDetail;
            $scope.listInvoiceDetails = response.data.listInvoiceDetails;
            $scope.totalItems = $scope.listProductDetail.length;

            console.log("Danh sách listInvoiceDetails sản phẩm: ", $scope.listInvoiceDetails);
            console.log("Danh sách thể loại sản phẩm: ", $scope.listCategoryTypes);
            console.log("Danh sách loại sản phẩm: ", $scope.listCategories);
            console.log("Danh sách tác giả: ", $scope.listBookAuthor);
            console.log("Danh sách sản phẩm giảm giá: ", $scope.listProductDiscount);
            console.log("Danh sách đánh giá sản phẩm: ", $scope.listProductReviews);
            console.log("Danh sách thương hiệu: ", $scope.listBrands);
            console.log("Danh sách ảnh mở rộng của sản phẩm: ", $scope.listProductImages);
            // Hiển thị thông tin đã lấy được trong console
            console.log("Danh sách sản phẩm chi tiết: ", $scope.listProductDetail);
        }).catch(function (error) {
            console.error("Lỗi call API: ", error);
        });
    };
    //Ngày nhập mới nhất
    function getNearestImportInvoiceCreateDate(productDetailId) {
        let nearestCreateDate = null;
        for (const detail of $scope.listImportInvoiceDetail) {
            if (detail.productDetail.productDetailId === productDetailId) {
                const createDate = new Date(detail.importInvoice.createDate);
                if (!nearestCreateDate || createDate > nearestCreateDate) {
                    nearestCreateDate = createDate;
                }
            }
        }
        return nearestCreateDate;
    }
    //Đếm số lượt mua nhiều nhất
    $scope.countSoldQuantity = function (productDetailId) {
        var totalQuantity = $scope.listInvoiceDetails.reduce(function (sum, item) {
            if (item.productDetail.productDetailId === productDetailId) {
                return sum + item.quantity;
            }
            return sum;
        }, 0);
        return totalQuantity;
    };

    //sort
    $scope.sortBy = 'newest'; // Mặc định sắp xếp theo 'Mới nhất'

    $scope.onSortChange = function () {
        if ($scope.sortBy === 'newest') {
            $scope.listProductDetail.sort((a, b) => {
                // Tìm ngày tạo gần nhất trong listImportInvoiceDetail cho sản phẩm a
                const createDateA = getNearestImportInvoiceCreateDate(a.productDetailId);
                // Tìm ngày tạo gần nhất trong listImportInvoiceDetail cho sản phẩm b
                const createDateB = getNearestImportInvoiceCreateDate(b.productDetailId);
                return createDateB - createDateA;
            });
        } else if ($scope.sortBy === 'bestSelling') {
            $scope.listProductDetail.sort((a, b) => {
                const quantityA = $scope.countSoldQuantity(a.productDetailId);
                const quantityB = $scope.countSoldQuantity(b.productDetailId);
                return quantityB - quantityA;
            });
        } else if ($scope.sortBy === 'lowestPrice') {
            $scope.listProductDetail.sort((a, b) => a.price - b.price);
        } else if ($scope.sortBy === 'highestPrice') {
            $scope.listProductDetail.sort((a, b) => b.price - a.price);
        }
    };

    $scope.selectedCategoryId = null;
    $scope.selectedCategoryName = null;
    // $scope.selectedCategory = null;
    $scope.selectCategory = function (categoryId, categoryName) {
        // Gán categoryId và categoryName vào biến để sử dụng trong việc hiển thị breadcrumb
        $scope.selectedCategoryId = categoryId;
        $scope.selectedCategoryName = categoryName;
        console.log($scope.selectedCategoryId);
        $scope.getDataProductDetail(); // Gọi lại hàm lấy dữ liệu để cập nhật danh sách sản phẩm
    };
    $scope.changeItemsPerPage = function () {
        console.log("Đã gọi hàm changeItemsPerPage");
        // Cập nhật số lượng phần tử mỗi trang
        $scope.currentPage = 1; // Đặt lại trang về trang đầu
        $scope.getDataProductDetail(); // Gọi lại hàm lấy dữ liệu để cập nhật danh sách sản phẩm với itemsPerPage mới
    };

    // SCOPE_FUNCTION GET DATA - END
    //===========================
    // SCOPE_FUNCTION GET DATA WITH PARAMETERS - START

    // RETURN SINGLE DATA - START

    $scope.getAuthorNameByProductId = function (id) {
        var bookAuthor = null;
        $scope.listBookAuthor.find(e => {
            if (e.product.productId === id) {
                bookAuthor = e;
            }
        });
        return bookAuthor ? bookAuthor.author.authorName : '';
    }

    $scope.getDiscountValueByProductId = function (id) {
        var discountValue = null;
        $scope.listProductDiscount.find(e => {
            if (e.productDetail.productDetailId === id) {
                discountValue = e.discount.value
            }
        });
        return discountValue ? discountValue : 0;
    }

    // RETURN SINGLE DATA - END
    //  RETURN LIST DATA - START

    $scope.getListCateByCateTypeId = function (typeId) {
        return $scope.listCategories.filter(category => category.typeId.typeId === typeId);
    }

    $scope.getListImagesByProductDetailId = function (productDetailId) {
        return $scope.listProductImages.filter(pi => pi.productDetail.productDetailId === productDetailId);
    }

    // RETURN LIST DATA - END
    // SCOPE_FUNCTION GET DATA WITH PARAMETERS - END

    // SCOPE_FUNCTION FOR UI - START

    // đếm số bài review của sản phẩm
    $scope.countReviewsOfProduct = function (productId) {
        var totalReviews = 0;
        $scope.listProductReviews.forEach(review => {
            if (review.productDetail.productDetailId === productId) {
                totalReviews++;
            }
        })
        return totalReviews;
    }

    // tính số sao vote của sản phẩm
    $scope.getStarRatingByProductId = function (productDetailId) {
        var totalStars = 0;
        var totalReviews = 0;

        $scope.listProductReviews.forEach(review => {
            if (review.productDetail.productDetailId === productDetailId) {
                totalStars += review.star;
                totalReviews++;
            }
        });
        if (totalReviews > 0) {
            var averageRating = totalStars / totalReviews;
            return Math.round(averageRating);
        } else {
            return 0;
        }
    }

    // xem nhanh thông tin sản phẩm
    $scope.quickView = function (productDetail) {
        $scope.quickViewProduct = productDetail;
        $scope.listImageQuickView = $scope.getListImagesByProductDetailId($scope.quickViewProduct.productDetailId);
        console.log($scope.listImageQuickView);
        $scope.quantityQuickViewProduct = 1;
    }


    // PAGINATION - START
    // hiển thị đang xem sản phẩm thứ bao nhiêu trong danh sách
    $scope.calculateRange = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + 1;
        var endIndex = $scope.currentPage * $scope.itemsPerPage;

        if (endIndex > $scope.totalItems) {
            endIndex = $scope.totalItems;
        }

        return startIndex + ' đến ' + endIndex + ' trên tổng số ' + $scope.totalItems + ' mục';
    };

    // Hàm chuyển đổi trang
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    // PAGINATION - END
    // SCOPE_FUNCTION FOR UI - END
    $scope.navigateToProductDetail = function (productDetailId) {
        console.log("DÔ ĐÂY", productDetailId);
        window.location.href = '/product-details?id=' + productDetailId;
    };

    $scope.init = function () {
        $scope.getDataProductDetail();
    }

    $scope.init();
}

// $scope.getData = function () {
//     var url = host + "/data";
//     $http.get(url).then(response => {
//         $scope.listProductDetail = response.data.listProductDetail;
//         $scope.listCategoryTypes = response.data.listCategoryTypes;
//         $scope.listCategories = response.data.listCategories;
//         $scope.listBookAuthor = response.data.listBookAuthor;
//         $scope.listProductDiscount = response.data.listProductDiscount;
//         $scope.listProductReviews = response.data.listProductReviews;
//         $scope.listBrands = response.data.listBrands;
//         $scope.listProductImages = response.data.listProductImages;

//         $scope.totalItems = $scope.listProductDetail.length;

//         console.log("Danh sách sản phẩm chi tiết: ", $scope.listProductDetail);
//         console.log("Danh sách thể loại sản phẩm: ", $scope.listCategoryTypes);
//         console.log("Danh sách loại sản phẩm: ", $scope.listCategories);
//         console.log("Danh sách tác giả: ", $scope.listBookAuthor);
//         console.log("Danh sách sản phẩm giảm giá: ", $scope.listProductDiscount);
//         console.log("Danh sách đánh giá sản phẩm: ", $scope.listProductReviews);
//         console.log("Danh sách thương hiệu: ", $scope.listBrands);
//         console.log("Danh sách ảnh mở rộng của sản phẩm: ", $scope.listProductImages);

//     }).catch(function (error) {
//         console.error("Lỗi call api: ", error);
//     });
// }