app.controller("ProductController", function ($scope, $location, $routeParams, $http, $filter) {
        $scope.$on("$routeChangeSuccess", function (event, current, previous) {
            $scope.page.setTitle(current.$$route.title || " Quản Lý Sản Phẩm");
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
        $scope.productPriceHistories = [];
        $scope.defaultImage =
            "https://res.cloudinary.com/dmbh3sz8s/image/upload/v1698734857/authors/author_1698734855371.jpg"; // Thay thế đường dẫn thực bằng đường dẫn hình ảnh mặc định thực tế
        $scope.product = {
            createAt: new Date(),
        };

        $scope.selectedItemIndex = -1; // Biến lưu trạng thái sản phẩm đang được chỉnh sửa
        $scope.showActiveProducts = true; // Mặc định hiển thị danh sách đang kinh doanh
        $scope.itemsPerPageOptions = [5, 10, 20, 50];
        $scope.itemsPerPage = 5;
        $scope.currentPage = 1;
        $scope.orderByField = "";
        $scope.reverseSort = true;
        $scope.searchText = ""; // Thêm trường searchText cho ô tìm kiếm
        $scope.errors = "";


        $scope.combinedData = [];

        $scope.exportToExcel = function () {
            // Chuẩn bị dữ liệu
            var dataToExport = $scope.combinedData.map(function (item) {
                // Chuẩn bị dữ liệu thuộc tính và giá trị thuộc tính
                var attributes = item.attributeValues.map(function (attribute) {
                    return attribute.attributeId.nameAtributes + ': ' + attribute.value;
                });

                return {
                    'Mã Sản Phẩm': item.product.productId,
                    'Tên Sản Phẩm': item.product.productName,
                    'Giá': $filter('currency')(item.productDetail.price, 'VND'),
                    'Thương Hiệu': item.product.brand.brandName,
                    'Tác Giả': item.bookAuthor ? (item.bookAuthor.author ? item.bookAuthor.author.authorName : '') : '',
                    'NXB': item.product.publisher.publisherName,
                    'Danh Mục': item.productCategory.category.categoryName,
                    'NSX': $filter('date')(item.product.manufactureDate, 'dd/MM/yyyy'),
                    'Ảnh': item.productDetail.image,
                    'Ngày Tạo': $filter('date')(item.product.createAt, 'dd/MM/yyyy HH:mm:ss'),
                    'Trạng Thái': item.product.status ? 'Đang kinh doanh' : 'Ngừng kinh doanh',
                    'Mô Tả': item.product.description,
                    'Số Lượng': item.productDetail.quantityInStock,
                    'Khối Lượng': item.productDetail.weight,
                    'Thuộc tính': attributes.join(', '), // Gộp tất cả thuộc tính thành một chuỗi
                };
            });

            // Tạo workbook và worksheet
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(dataToExport);

            // Thêm worksheet vào workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Products');

            // Xuất file Excel
            var fileName = 'products.xlsx';
            XLSX.writeFile(wb, fileName);
        };


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

                                                    // Lấy dữ liệu các giá trị thuộc tính sản phẩm
                                                    $http
                                                        .get("/rest/attributeValues")
                                                        .then((attributeValuesResp) => {
                                                            var attributeValues = attributeValuesResp.data;

                                                            $http
                                                                .get("/rest/productImages")
                                                                .then((productImagesResp) => {
                                                                    var productImages = productImagesResp.data;

                                                                    $http
                                                                        .get("/rest/productPriceHistories")
                                                                        .then((productPriceHistoriesResp) => {
                                                                            var productPriceHistories = productPriceHistoriesResp.data;

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

                                                                                var matchingAttributeValues = [];
                                                                                var matchingImages = [];

                                                                                if (matchingDetail && matchingDetail.productDetailId) {
                                                                                    matchingAttributeValues = attributeValues.filter(function (value) {
                                                                                        return value.productDetail && value.productDetail.productDetailId === matchingDetail.productDetailId;
                                                                                    });

                                                                                    matchingImages = productImages.filter(function (image) {
                                                                                        return image.productDetail && image.productDetail.productDetailId === matchingDetail.productDetailId;
                                                                                    });
                                                                                }

                                                                                var matchingPriceHistories = null;

                                                                                if (matchingDetail && matchingDetail.productDetailId) {
                                                                                    matchingPriceHistories = productPriceHistories.find(function (price) {
                                                                                        return price.productDetail && price.productDetail.product.productId === product.productId;
                                                                                    });
                                                                                }


                                                                                return {
                                                                                    product: product,
                                                                                    productDetail: matchingDetail,
                                                                                    productCategory: matchingCategory,
                                                                                    bookAuthor: matchingAuthor,
                                                                                    productDiscount: matchingDiscount,
                                                                                    attributeValues: matchingAttributeValues,
                                                                                    productImages: matchingImages,
                                                                                    productPriceHistories: matchingPriceHistories

                                                                                };
                                                                            });


                                                                        })

                                                                        .catch((productPriceHistoriesError) => {
                                                                            console.log("Error", productPriceHistoriesError);
                                                                        });
                                                                })
                                                                .catch((productImagesError) => {
                                                                    console.log("Error", productImagesError);
                                                                });
                                                        })
                                                        .catch((attributeValuesError) => {
                                                            console.log("Error", attributeValuesError);
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


        // Tạo một mảng chứa các promise
        var promises = [
            $http.get("/rest/productAttributes"),
            $http.get("/rest/attributeValues"),
            $http.get("/rest/categories"),
            $http.get("/rest/authors"),
            $http.get("/rest/discounts"),
            $http.get("/rest/brand"),
            $http.get("/rest/publishers"),
            $http.get("/rest/productImages"),


        ];

        // Sử dụng Promise.all để đợi tất cả các promise hoàn thành
        Promise.all(promises)
            .then(function (responses) {
                // Gán dữ liệu cho các $scope tương ứng
                $scope.productAttributes = responses[0].data;
                $scope.attributeValues = responses[1].data;
                $scope.categories = responses[2].data;
                $scope.authors = responses[3].data;
                $scope.discounts = responses[4].data;
                $scope.brands = responses[5].data;
                $scope.publishers = responses[6].data;
                $scope.productImages = responses[7].data;

            })
            .catch(function (error) {
                console.log("Error", error);
            });


        $scope.saveProduct = function () {
            var formData = new FormData();
            var fileInput = document.getElementById("fileInput");

            // Lưu hình ảnh sản phẩm
            if (fileInput && fileInput.files.length > 0) {
                formData.append("image", fileInput.files[0]);
            }

            // Lưu nhiều hình ảnh sản phẩm
            for (var i = 0; i < $scope.selectedImages.length; i++) {
                formData.append("file", $scope.selectedImages[i].file);
            }

            // Tạo id ngẫu nhiên nếu đang thêm sản phẩm mới
            if (!$scope.isEditing) {
                $scope.product.productId = generateRandomId();
            }

            if (!$scope.checkErrors()) {
                return;
            }

            // Tạo mảng attributeValues từ productAttributes
            var attributeValues = [];
            for (var i = 0; i < $scope.productAttributes.length; i++) {
                if ($scope.productAttributes[i].isSelected) {
                    var attributeValue = {
                        attributeId: $scope.productAttributes[i],
                        value: $scope.productAttributes[i].value
                    };
                    attributeValues.push(attributeValue);
                    console.log(attributeValue);
                }

            }

            var data = {
                product: $scope.product || "",
                status: $scope.product.status = true,
                category: $scope.productCategory.category || "",
                author: $scope.bookAuthor ? $scope.bookAuthor.author : null,
                discount: $scope.productDiscount.discount || "",
                productDetail: $scope.productDetail || "",
                image: $scope.productDetail.image || "",
                attributeValues: attributeValues || ""
            };


            var dataJson = JSON.stringify(data);
            formData.append("dataJson", dataJson);

            var url = `${host}`;
            $http
                .post(url, formData, {
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

        };


        $scope.updateProduct = function () {
            var formData = new FormData();
            var fileInput = document.getElementById("fileInput");

            if (fileInput && fileInput.files.length > 0) {
                // Lưu hình ảnh sản phẩm
                formData.append("image", fileInput.files[0]);
            }

            // Lưu nhiều hình ảnh sản phẩm
            for (var i = 0; i < $scope.editingProduct.productImages.length; i++) {
                var image = $scope.editingProduct.productImages[i];
                if (!image.deleted) {
                    // Nếu ảnh không bị xóa, thì mới thêm vào formData
                    formData.append("file", image.file);
                }
            }


            var data = {
                product: $scope.editingProduct.product,
                category: $scope.editingProduct.productCategory.category,
                author: $scope.editingProduct.bookAuthor.author,
                discount: $scope.editingProduct.productDiscount.discount,
                productDetail: $scope.editingProduct.productDetail,
                attributeValues: $scope.editingProduct.attributeValues,
            };

            console.log(data);

            var dataJson = JSON.stringify(data);
            formData.append("dataJson", dataJson);

            var url = `${host}/${$scope.editingProduct.product.productId}`;
            $http.put(url, formData, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined,
                },
            })
                .then((resp) => {
                    // Cập nhật ảnh trong mảng, bỏ qua những ảnh đã bị xóa
                    $scope.editingProduct.productImages = $scope.editingProduct.productImages.filter(function (image) {
                        return !image.deleted;
                    });

                    $scope.loadProducts();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Cập nhật sản phẩm ${data.product.productId} thành công `,
                    });
                    $scope.clearImage();
                })
                .catch((error) => {
                    console.log(error.data);
                    if (error.data) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Cập nhật sản phẩm ${data.product.productId} thất bại `,
                        });
                    }
                });
        };


        $scope.onCategoryChange = function () {
            // Lấy typeID của danh mục được chọn
            var selectedCategoryId = $scope.productCategory.category.categoryId;

            // Tìm danh mục tương ứng để lấy typeID
            var selectedCategory = $scope.categories.find(function (category) {
                return category.categoryId === selectedCategoryId;
            });

            // Kiểm tra nếu typeID của danh mục được chọn là 1
            if (selectedCategory && selectedCategory.typeId && selectedCategory.typeId.typeId === "1") {
                $scope.showAuthorSelect = true; // Hiển thị form chọn tên tác giả
            } else {
                $scope.showAuthorSelect = false; // Ẩn form chọn tên tác giả
            }
        };

        $scope.openAddAuthorModal = function () {
            $scope.editingAuthor = {};
        }
        $scope.saveAuthor = function (authorId) {
            var formData = new FormData();
            var fileInput = document.getElementById("fileInput");

            if (fileInput && fileInput.files.length > 0) {
                formData.append("image", fileInput.files[0]);
            }

            if (!$scope.isEditing) {
                $scope.editingAuthor.authorId = generateRandomId();
            }

            formData.append(
                "authorJson",
                JSON.stringify({
                    authorId: $scope.editingAuthor.authorId || "",
                    authorName: $scope.editingAuthor.authorName || "",
                    gender: $scope.editingAuthor.gender || false,
                    nation: $scope.editingAuthor.nation || "",
                })
            );

            var url = "http://localhost:8081/rest/authors";
            $http
                .post(url, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined,
                    },
                })
                .then((resp) => {
                    // Thêm tác giả vào danh sách hiện có
                    $scope.authors.push({
                        authorId: $scope.editingAuthor.authorId,
                        authorName: $scope.editingAuthor.authorName,
                        gender: $scope.editingAuthor.gender || false,
                        nation: $scope.editingAuthor.nation || "",
                        image: resp.data.image || "", // Sử dụng ảnh từ phản hồi của server (nếu có)
                    });

                    // Đặt tên tác giả mới thêm vào combobox
                    $scope.bookAuthor.author = $scope.editingAuthor.authorName;

                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Thêm tác giả ${authorId} thành công `,
                    });
                })
                .catch((error) => {
                    console.log(error.data);
                    if (error.data) {
                        Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: `Thêm tác giả ${authorId} thất bại `,
                        });
                    }
                });
        };


        $scope.calculateDiscountedPrice = function (item) {
            // Kiểm tra nếu ngày kết thúc lớn hơn ngày hiện tại
            if (new Date(item.productDiscount.discount.endDate) > new Date()) {
                // Nếu còn hiệu lực, giảm giá sẽ được áp dụng
                return $filter("number")(item.productDetail.priceDiscount) + " VND";
            } else {
                item.productDiscount.discount.value = 0;
                // Nếu không còn hiệu lực, giá giảm trở thành giá ban đầu
                return $filter("number")(item.productDetail.price) + " VND";
            }
        };


        $scope.toggleProductStatus = function (productId, isCurrentlyActive) {
            if (!isCurrentlyActive) {
                // Nếu sản phẩm không đang kinh doanh, vẫn gọi API để chuyển sang đang kinh doanh
                var url = `${host}/${productId}/toggleStatus`;
                $http.patch(url)
                    .then((resp) => {
                        // Xử lý phản hồi thành công nếu cần
                        console.log('Product status updated successfully.');
                        $scope.loadProducts();
                        $scope.clearImage();
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: `Bắt đầu kinh doanh sản phẩm ${productId} thành công`,
                        });
                    })
                    .catch((error) => {
                        console.error('Error updating product status:', error.data);
                        if (error.data) {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Cập nhật trạng thái sản phẩm thất bại `,
                            });
                        }
                    });
                return;
            }

            // Nếu sản phẩm đang kinh doanh, hiển thị thông báo xác nhận
            Swal.fire({
                title: "Ngừng kinh doanh sản phẩm?",
                text: `Bạn muốn ngừng kinh doanh hàng hóa mã ${productId} trên hệ thống?\n\nLưu ý:\n- Thông tin tồn kho và lịch sử giao dịch vẫn được giữ.\n- Hàng hóa quy đổi liên quan cũng sẽ ngừng kinh doanh.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Có",
                cancelButtonText: "Không",
            }).then((result) => {
                if (result.isConfirmed) {
                    var url = `${host}/${productId}/toggleStatus`;
                    $http.patch(url)
                        .then((resp) => {
                            // Xử lý phản hồi thành công nếu cần
                            console.log('Product status updated successfully.');
                            $scope.loadProducts();
                            $scope.clearImage();
                            Swal.fire({
                                icon: "success",
                                title: "Thành công",
                                text: `Ngừng kinh doanh sản phẩm ${productId} thành công`,
                            });
                        })
                        .catch((error) => {
                            console.error('Error updating product status:', error.data);
                            if (error.data) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Thất bại",
                                    text: `Cập nhật trạng thái sản phẩm thất bại `,
                                });
                            }
                        });
                }
            });
        };


        // Trong controller AngularJS của bạn
        $scope.deleteProduct = function (productId) {
            Swal.fire({
                title: "Xóa Hàng Hóa?",
                text: "Hệ thống sẽ xóa hoàn toàn sản phẩm " + productId + "  nhưng vẫn giữ thông tin trong các giao dịch lịch sử nếu có. Bạn có chắc chắn muốn xóa?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Có",
                cancelButtonText: "Không",
            }).then((result) => {
                if (result.isConfirmed) {
                    var url = `${host}/${productId}`;
                    $http.delete(url)
                        .then((resp) => {
                            // Xử lý phản hồi thành công nếu cần
                            console.log('Product soft-deleted successfully.');
                            $scope.loadProducts();
                            $scope.clearImage();
                            Swal.fire({
                                icon: "success",
                                title: "Thành công",
                                text: `Xóa mềm sản phẩm ${productId} thành công`,
                            });
                        })
                        .catch((error) => {
                            console.error('Error soft-deleting product:', error.data);
                            if (error.data) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Thất bại",
                                    text: `Xóa mềm sản phẩm ${productId} thất bại`,
                                });
                            }
                        });
                }
            });
        };


        // Hàm tạo id ngẫu nhiên với "AU00" và 3 số ngẫu nhiên
        function generateRandomId() {
            let result = "PR32";
            for (let i = 0; i < 3; i++) {
                result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
            }
            return result;
        }


        $scope.showImage = function (imageUrl, item) {
            // Chắc chắn rằng item và productDetail đã được định nghĩa trước khi truy cập
            if (item.productDetail) {
                // Hiển thị hình ảnh từ productImages lên ảnh chính
                item.productDetail.image = imageUrl;
            }
        };


        $scope.removeAttribute = function (index) {
            // Đặt thuộc tính "deleted" cho giá trị thuộc tính
            $scope.editingProduct.attributeValues[index].value = null; // hoặc gán bằng giá trị mặc định khác

        };


        $scope.checkErrors = function () {
            $scope.errors = {};
            $scope.attributeErrors = [];
            if (!$scope.product.productName) {
                $scope.errors.productName = 'Vui lòng nhập tên sản phẩm.';
            }

            if (!$scope.product.brand) {
                $scope.errors.brandName = 'Vui lòng chọn thương hiệu.';
            }

            if (!$scope.productCategory) {
            }

            if (!$scope.product.publisher) {
                $scope.errors.publisherName = 'Vui lòng chọn nhà xuất bản.';
            }

            if (!$scope.product.manufactureDate) {
                $scope.errors.manufactureDate = 'Vui lòng chọn ngày sản xuất.';
            }


            if (!$scope.productDiscount) {
                $scope.errors.values = 'Vui lòng chọn phần trăm giảm giá.';
            }

            if (!$scope.productDetail) {
                $scope.errors.price = 'Vui lòng nhập giá sản phẩm.';
            }

            if (!$scope.productDetail) {
                $scope.errors.quantityInStock = 'Vui lòng nhập số lượng.';
            }

            if (!$scope.productDetail) {
                $scope.errors.weight = 'Vui lòng nhập khối lượng.';
            }

            for (var i = 0; i < $scope.productAttributes.length; i++) {
                var attributeError = {};
                if (!$scope.productAttributes[i].value && $scope.productAttributes[i].isSelected) {
                    attributeError.value = 'Vui lòng nhập giá trị thuộc tính.';
                }

                $scope.attributeErrors.push(attributeError);
            }
            var hasErrors = Object.keys($scope.errors).length > 0;

            return !hasErrors;
        };


        $scope.hideError = function (productName) {
            // Ẩn thông báo lỗi cho trường fieldName
            $scope.errors[productName] = '';

        };
        $scope.hideError = function (brandName) {
            // Ẩn thông báo lỗi cho trường fieldName
            $scope.errors[brandName] = '';

        };

        $scope.hideError = function (publisherName) {
            // Ẩn thông báo lỗi cho trường fieldName
            $scope.errors[publisherName] = '';

        };

        $scope.hideError = function (values) {
            // Ẩn thông báo lỗi cho trường fieldName
            $scope.errors[values] = '';

        };
        $scope.hideError = function (price) {
            // Ẩn thông báo lỗi cho trường fieldName
            $scope.errors[price] = '';

        };

        $scope.hideError = function (quantityInStock) {
            // Ẩn thông báo lỗi cho trường fieldName
            $scope.errors[quantityInStock] = '';

        };

        $scope.hideError = function (weight) {
            // Ẩn thông báo lỗi cho trường fieldName
            $scope.errors[weight] = '';

        };


        $scope.hideAttributeError = function (index) {
            // Ẩn thông báo lỗi cho thuộc tính khi người dùng chọn lại giá trị
            $scope.attributeErrors[index].value = '';
        };


        $scope.$watch('searchText', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.loadProducts();
            }

        });
        $scope.sortBy = function (field) {
            if ($scope.orderByField === field) {
                $scope.reverseSort = !$scope.reverseSort;
            } else {
                $scope.orderByField = field;
                $scope.reverseSort = true;
            }
        };

        $scope.calculateRange = function () {
            var filteredData = $scope.getFilteredData();
            var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
            var end = Math.min(
                start + $scope.itemsPerPage,
                filteredData.length
            );
            return start + 1 + "-" + end + " of " + filteredData.length;
        };

        $scope.updatePagination = function () {
            $scope.currentPage = 1;
        };

        $scope.getFilteredData = function () {
            return $scope.combinedData.filter(function (item) {
                return item.product.status === $scope.showActiveProducts;
            });
        };


        $scope.editProduct = function (productId, index) {
            // Tìm sản phẩm cụ thể trong mảng $scope.combinedData dựa trên productId
            var productToEdit = $scope.combinedData.find(function (product) {
                return product.product.productId === productId;
            });
            $scope.selectedItemIndex = index; // Lưu chỉ số sản phẩm đang được chỉnh sửa

            if (productToEdit) {
                // Gán giá trị của sản phẩm được chọn vào biến editingProduct
                $scope.editingProduct = angular.copy(productToEdit);
                $scope.editingProduct.product.manufactureDate = new Date(
                    $scope.editingProduct.product.manufactureDate
                ); // Chuyển đổi thành kiểu ngày
                $scope.isEditing = true; // Đặt cờ chỉnh sửa
            }
        };


        $scope.resetForm = function () {
            $scope.editingProduct = {};
            $scope.isEditing = false;
            $scope.product = {
                createAt: new Date(),
            };
        };

        $scope.selectedImages = [];
        // // Hàm xử lý khi người dùng chọn nhiều ảnh
        $scope.onImageSelect = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageUrl = URL.createObjectURL(file);
                $scope.$apply(function () {
                    $scope.selectedImages.push({file: file, image: imageUrl});
                });
            }
            console.log(files);
        };

        // Hàm xử lý khi người dùng xóa một ảnh
        $scope.deleteImage = function (index) {
            // Loại bỏ ảnh khỏi mảng selectedImages
            $scope.selectedImages.splice(index, 1);
        };

        $scope.deleteAttribute = function (index) {
            // Kiểm tra xem `index` có nằm trong phạm vi của mảng `productAttributes` không
            if (index >= 0 && index < $scope.productAttributes.length) {
                // Gán tên thuộc tính và giá trị thuộc tính tại vị trí `index` thành null hoặc giá trị mặc định
                $scope.productAttributes[index].value = null; // hoặc gán bằng giá trị mặc định khác
            }
        };


        $scope.deleteImageInEdit = function (index) {
            var imageIdToDelete = $scope.editingProduct.productImages[index].id; // Thay đổi id thành trường id thực tế của ảnh trong đối tượng
            let host1 = "http://localhost:8081/rest/productImages";
            // Gọi API xóa ảnh
            $http.delete(`${host1}/images/${imageIdToDelete}`)
                .then((resp) => {
                    // Xóa ảnh khỏi mảng nhưng giữ nguyên id
                    $scope.editingProduct.productImages[index].deleted = true;
                    $scope.editingProduct.productImages.splice(index, 1);
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Xóa ảnh thành công`,
                    });
                })
                .catch((error) => {
                    console.log(error.data);
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Xóa ảnh thất bại`,
                    });
                });
        };


        $scope.onEditImageSelect = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageUrl = URL.createObjectURL(file);
                $scope.$apply(function () {
                    $scope.editingProduct.productImages.push({file: file, image: imageUrl});
                });
            }
        };


        $scope.loadProducts();
    }
);

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
