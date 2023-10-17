app.controller("productPageController", productPageController);

function productPageController($http, $scope, productPageAPI, CartService) {
    const host = productPageAPI;

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
    $scope.itemsPerPage = 36;
    // pagination - END

    // DECLARE SCOPE FOR UI - END
    //=================================
    // SCOPE_FUNCTION GET DATA - START
    $scope.getData = function () {
        var url = host + "/data";
        $http.get(url).then(response => {
            $scope.listProductDetail = response.data.listProductDetail;
            $scope.listCategoryTypes = response.data.listCategoryTypes;
            $scope.listCategories = response.data.listCategories;
            $scope.listBookAuthor = response.data.listBookAuthor;
            $scope.listProductDiscount = response.data.listProductDiscount;
            $scope.listProductReviews = response.data.listProductReviews;
            $scope.listBrands = response.data.listBrands;
            $scope.listProductImages = response.data.listProductImages;

            $scope.totalItems = $scope.listProductDetail.length;

            console.log("Danh sách sản phẩm chi tiết: ", $scope.listProductDetail);
            console.log("Danh sách thể loại sản phẩm: ", $scope.listCategoryTypes);
            console.log("Danh sách loại sản phẩm: ", $scope.listCategories);
            console.log("Danh sách tác giả: ", $scope.listBookAuthor);
            console.log("Danh sách sản phẩm giảm giá: ", $scope.listProductDiscount);
            console.log("Danh sách đánh giá sản phẩm: ", $scope.listProductReviews);
            console.log("Danh sách thương hiệu: ", $scope.listBrands);
            console.log("Danh sách ảnh mở rộng của sản phẩm: ", $scope.listProductImages);

        }).catch(function (error) {
            console.error("Lỗi call api: ", error);
        });
    }
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
            if (review.product.productId === productId) {
                totalReviews++;
            }
        })
        return totalReviews;
    }

    // tính số sao vote của sản phẩm
    $scope.getStarRatingByProductId = function (productId) {
        var totalStars = 0;
        var totalReviews = 0;

        $scope.listProductReviews.forEach(review => {
            if (review.product.productId === productId) {
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

    $scope.init = function () {
        $scope.getData();
    }

    $scope.init();


}
