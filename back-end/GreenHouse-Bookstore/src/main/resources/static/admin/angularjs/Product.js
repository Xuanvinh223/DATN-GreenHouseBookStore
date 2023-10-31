app.controller("ProductController", function ($scope, $location, $routeParams, $http) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản Lý Sản Phẩm');
    });
    let host = "http://localhost:8081/rest/products";
    $scope.editingProduct = {};
    $scope.isEditing = false;
    $scope.products = [];
    $scope.brands = [];
    $scope.publishers = [];
    $scope.categories = [];
    $scope.authors = [];
    $scope.bookAuthors = [];
    $scope.productCategories = [];
    $scope.productAttributes = [];
    $scope.attributeValues = [];
    $scope.productDetails = [];
    $scope.productImages = [];
    $scope.discounts = [];
    $scope.productDiscounts = [];
    $scope.editingProduct = {
        createAt: new Date()
    };


    $scope.combinedData = [];

    $scope.loadProducts = function () {
        // Lấy dữ liệu sản phẩm và sản phẩm chi tiết
        var productsUrl = `${host}`;
        var productDetailsUrl = "/rest/productDetails";

        $http
            .get(productsUrl)
            .then((productsResp) => {
                $http
                    .get(productDetailsUrl)
                    .then((productDetailsResp) => {
                        var products = productsResp.data;
                        var productDetails = productDetailsResp.data;

                        // Lấy dữ liệu danh mục sản phẩm
                        $http
                            .get("/rest/productCategories")
                            .then((productCategoriesResp) => {
                                var productCategories = productCategoriesResp.data;

                                // Lấy dữ liệu tác giả sách
                                $http
                                    .get("/rest/bookAuthors")
                                    .then((bookAuthorsResp) => {
                                        var bookAuthors = bookAuthorsResp.data;

                                        // Lấy dữ liệu sản phẩm giảm giá
                                        $http
                                            .get("/rest/productDiscounts")
                                            .then((productDiscountsResp) => {
                                                var productDiscounts = productDiscountsResp.data;

                                                // Lấy dữ liệu sản phẩm giảm giá
                                                $http
                                                    .get("/rest/productImages")
                                                    .then((productImagesResp) => {
                                                        var productImages = productImagesResp.data;

                                                        // Tạo mảng combinedData bằng cách kết hợp dữ liệu từ tất cả các URL
                                                        $scope.combinedData = products.map(function (product) {
                                                            var matchingDetail = productDetails.find(function (detail) {
                                                                return detail.product.productId === product.productId;
                                                            });

                                                            var matchingCategory = productCategories.find(function (category) {
                                                                return category.product.productId === product.productId;
                                                            });

                                                            var matchingAuthor = bookAuthors.find(function (author) {
                                                                return author.product.productId === product.productId;
                                                            });

                                                            var matchingDiscount = productDiscounts.find(function (discount) {
                                                                return discount.productDetail.product.productId === product.productId;
                                                            });

                                                            var matchingImages = productImages.find(function (images) {
                                                                return images.productDetail.product.productId === product.productId;
                                                            });

                                                            return {
                                                                product: product,
                                                                productDetail: matchingDetail,
                                                                productCategory: matchingCategory,
                                                                bookAuthor: matchingAuthor,
                                                                productDiscount: matchingDiscount,
                                                                pdImages: matchingImages,
                                                            };
                                                        });
                                                    })
                                                    .catch((productImagesError) => {
                                                        console.log("Error", productImagesError);
                                                    });
                                            })
                                            .catch((productDiscountsError) => {
                                                console.log("Error", productDiscountsError);
                                            });
                                    })
                                    .catch((bookAuthorsError) => {
                                        console.log("Error", bookAuthorsError);
                                    });
                            })
                            .catch((productCategoriesError) => {
                                console.log("Error", productCategoriesError);
                            });
                    })
                    .catch((productDetailsError) => {
                        console.log("Error", productDetailsError);
                    });
            })
            .catch((productsError) => {
                console.log("Error", productsError);
            });
    };


    // Hàm lấy danh sách các hình ảnh dựa trên khóa ngoại productDetail
    $scope.getProductImages = function (productDetailId) {
        return $scope.productImages.filter(function (image) {
            return image.productDetail.productDetailId === productDetailId;
        });
    };
    // Lấy dữ liệu loại danh mục
    $http
        .get("/rest/productAttributes")
        .then((resp) => {
            $scope.productAttributes = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });


    // Lấy dữ liệu loại danh mục
    $http
        .get("/rest/attributeValues")
        .then((resp) => {
            $scope.attributeValues = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    // Lấy dữ liệu loại danh mục
    $http
        .get("/rest/categories")
        .then((resp) => {
            $scope.categories = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    // Lấy dữ liệu sản phẩm chi tiết
    $http
        .get("/rest/productDetails")
        .then((resp) => {
            $scope.productDetails = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });
    // Lấy dữ liệu danh mục sản phẩm
    $http
        .get("/rest/productCategories")
        .then((resp) => {
            $scope.productCategories = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });
    // Lấy dữ liệu tác giả sách
    $http
        .get("/rest/bookAuthors")
        .then((resp) => {
            $scope.bookAuthors = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    // Lấy dữ liệu sản phẩm giảm giá
    $http
        .get("/rest/productDiscounts")
        .then((resp) => {
            $scope.productDiscounts = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    // Lấy dữ liệu loại tác giả
    $http
        .get("/rest/authors")
        .then((resp) => {
            $scope.authors = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });
    // Lấy dữ liệu loại giảm giá
    $http
        .get("/rest/discounts")
        .then((resp) => {
            $scope.discounts = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    // Lấy dữ liệu loại thương hiệu
    $http
        .get("/rest/brand")
        .then((resp) => {
            $scope.brands = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });


    // Lấy dữ liệu loại nhà xuất bản
    $http
        .get("/rest/publishers")
        .then((resp) => {
            $scope.publishers = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });

    // Lấy dữ liệu ảnh sản phẩm chi tiết
    $http
        .get("/rest/productImages")
        .then((resp) => {
            $scope.productImages = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });


    // Hàm tạo id ngẫu nhiên với "AU00" và 3 số ngẫu nhiên
    function generateRandomId() {
        let result = "PR32";
        for (let i = 0; i < 3; i++) {
            result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
        }
        return result;
    }



    $scope.saveProduct = function () {
        var formData = new FormData();
        var fileInput = document.getElementById("fileInput");

        if (fileInput && fileInput.files.length > 0) {
            // Lưu hình ảnh sản phẩm
            formData.append("image", fileInput.files[0]);
        }

        // Lưu nhiều hình ảnh sản phẩm
        for (var i = 0; i < $scope.selectedImages.length; i++) {
            formData.append('file', $scope.selectedImages[i].file);
        }

        // Tạo id ngẫu nhiên nếu đang thêm sản phẩm mới
        if (!$scope.isEditing) {
            $scope.editingProduct.product.productId = generateRandomId();
        }

        var data = {
            product: $scope.editingProduct.product,
            category: $scope.editingProduct.productCategory.category,
            author: $scope.editingProduct.bookAuthor.author,
            discount: $scope.editingProduct.productDiscount.discount,
            productDetail: $scope.editingProduct.productDetail,
            pdImages: $scope.editingProduct.pdImages
        };

        var dataJson = JSON.stringify(data);

        formData.append("dataJson", dataJson);

        if ($scope.isEditing) {
            var url = `${host}/${data.product.productId}`;
            $http
                .put(url, formData, {
                    transformRequest: angular.identity,
                    headers: {"Content-Type": undefined},
                })
                .then((resp) => {
                    $scope.loadProducts();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Cập nhật sản phẩm ${data.product.productId} thành công`,
                    });
                    $scope.clearImage();
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Cập nhật sản phẩm ${data.product.productId} thất bại`,
                    });
                });
        } else {
            var url = `${host}`;
            $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined,
                },
            })
                .then((resp) => {
                    $scope.loadProducts();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Thêm sản phẩm ${data.product.productId} thành công `,
                    });
                    $scope.clearImage();
                })
                .catch((error) => {
                    console.log(error.data);
                    if (error.data) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Thêm sản phẩm ${data.product.productId} thất bại `,
                        });
                    }
                });
        }
    };


    $scope.editProductAndRedirect = function (productId) {
        // Tìm sản phẩm tương ứng theo productId trong mảng combinedData
        var productToEdit = $scope.combinedData.find(function (item) {
            return item.product.productId === productId;
        });

        // Chuyển đến biểu mẫu chỉnh sửa sản phẩm và truyền thông tin sản phẩm để chỉnh sửa
        $location.path("/product-form").search({id: productId, data: angular.toJson(productToEdit)});
    };


    if ($routeParams.data) {
        $scope.editingProduct = angular.fromJson($routeParams.data);
        $scope.editingProduct.product.manufactureDate = new Date($scope.editingProduct.product.manufactureDate); // Chuyển đổi thành kiểu ngày
        $scope.editingProduct.product.createAt = new Date($scope.editingProduct.product.createAt); // Chuyển đổi thành kiểu ngày
        $scope.editingProduct.product.deleteAt = new Date($scope.editingProduct.product.deleteAt); // Chuyển đổi thành kiểu ngày
        $scope.isEditing = true;
    }


    $scope.deleteProduct = function (productId) {
        var url = `${host}/${productId}`;

        $http
            .delete(url)
            .then((resp) => {
                $scope.loadProducts();
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: `Xóa sản phẩm ${productId} thành công`,
                });
            })
            .catch((Error) => {
                Swal.fire({
                    icon: "error",
                    title: "Thất bại",
                    text: `Xóa sản phẩm ${productId} thất bại`,
                });
            });
    };

    $scope.calculateDiscount = function () {
        if ($scope.editingProduct.productDetail.price && $scope.editingProduct.productDiscount.discount) {
            var price = $scope.editingProduct.productDetail.price;
            var discount = $scope.editingProduct.productDiscount.discount.value;

            var priceDiscount = price - (price * discount / 100);
            $scope.editingProduct.productDetail.priceDiscount = priceDiscount;
        } else {
            $scope.editingProduct.productDetail.priceDiscount = null;
        }
    };


    $scope.resetForm = function () {
        $scope.editingProduct = {};
        $scope.isEditing = false;
    };


    $scope.selectedImages = [];

    // // Hàm xử lý khi người dùng chọn nhiều ảnh
    $scope.onImageSelect = function (event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageUrl = URL.createObjectURL(file);
            $scope.$apply(function () {
                $scope.selectedImages.push({file: file, url: imageUrl});
            });

        }
        console.log(files);
    };


    // Hàm xử lý khi người dùng xóa một ảnh
    $scope.deleteImage = function (index) {
        // Loại bỏ ảnh khỏi mảng selectedImages
        $scope.selectedImages.splice(index, 1);
    };


    $scope.loadProducts();
});

function displayImage(event) {
    var imageElement = document.getElementById("uploadedImage");
    var fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imageElement.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}


// Thêm sự kiện lắng nghe khi tải lên tệp
document.getElementById("fileInput").addEventListener("change", displayImage);
