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
    $scope.discounts = [];
    $scope.editingProduct = {
        createAt: new Date()
    };


    $scope.loadProducts = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.products = resp.data;
            })
            .catch((Error) => {
                console.log("Error", Error);
            });
    };
    // Lấy dữ liệu loại danh mục
    $http
        .get("/rest/categories")
        .then((resp) => {
            $scope.categories = resp.data;
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

    // Lấy dữ liệu loại tác giả
    $http
        .get("/rest/authors")
        .then((resp) => {
            $scope.authors = resp.data;
        })
        .catch((Error) => {
            console.log("Error", Error);
        });
    // Lấy dữ liệu loại tác giả
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


    // Hàm tạo id ngẫu nhiên với "AU00" và 3 số ngẫu nhiên
    function generateRandomId() {
        let result = "PR32";
        for (let i = 0; i < 3; i++) {
            result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
        }
        return result;
    }


    $scope.saveProduct = function () {
        // Tạo id ngẫu nhiên nếu đang thêm tác giả mới
        if (!$scope.isEditing) {
            $scope.editingProduct.productId = generateRandomId();
        }

        var product = {
            productId: $scope.editingProduct.productId,
            productName: $scope.editingProduct.productName || "",
            description: $scope.editingProduct.description || "",
            manufactureDate: $scope.editingProduct.manufactureDate || "",
            status: $scope.editingProduct.status || false,
            createAt: $scope.editingProduct.createAt || "",
            deleteAt: $scope.editingProduct.deleteAt || "",
            deleteBy: $scope.editingProduct.deleteBy || "",
            updateAt: $scope.editingProduct.updateAt || "",
            brand: $scope.editingProduct.brand,
            publisher: $scope.editingProduct.publisher,
        }

        var productDetail = {
            price: $scope.editingProduct.price || "",
            priceDiscount: $scope.editingProduct.priceDiscount || "",
            quantityInStock: $scope.editingProduct.quantityInStock || "",
            image: $scope.editingProduct.image,
            productImageId: $scope.editingProduct.productImageId,
        }

        // Kiểm tra xem discount đã hết hạn chưa
        var discountEndDate = $scope.editingProduct.discount ? new Date($scope.editingProduct.discount.endDate) : null;
        var currentDate = new Date();

        if (discountEndDate && discountEndDate < currentDate) {
            Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: "Giảm giá đã hết hạn",
            });
            return; // Không thực hiện lưu sản phẩm nếu giảm giá đã hết hạn
        }

        // Lấy thuộc tính "category" từ $scope.editingProduct và thêm vào đối tượng "data"
        var data = {
            product: product,
            category: $scope.editingProduct.category,
            author: $scope.editingProduct.author,
            discount: $scope.editingProduct.discount,
            productDetail: productDetail
        }

        if ($scope.isEditing) {
            var url = `${host}/${product.productId}`;
            $http
                .put(url, data)
                .then((resp) => {
                    // Cập nhật mảng sản phẩm với danh sách sản phẩm mới từ máy chủ
                    $scope.products = resp.data;
                    $scope.loadProducts();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Cập nhật sản phẩm ${product.productId}`,
                    });
                })
                .catch((Error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Cập nhật sản phẩm ${product.productId} thất bại`,
                    });
                });
        } else {
            var url = `${host}`;
            $http
                .post(url, data)
                .then((resp) => {
                    // Cập nhật mảng sản phẩm với danh sách sản phẩm mới từ máy chủ
                    $scope.products = resp.data;
                    $scope.loadProducts();
                    $scope.resetForm();
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: `Thêm sản phẩm ${product.productId}`,
                    });
                })
                .catch((Error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: `Thêm sản phẩm thất bại`,
                    });
                });
        }
    };

    $scope.editProductAndRedirect = function (productId) {
        var url = `${host}/${productId}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.editingProduct = resp.data;
                $scope.editingProduct.manufactureDate = new Date($scope.editingProduct.manufactureDate); // Chuyển đổi thành kiểu ngày
                $scope.editingProduct.createAt = new Date($scope.editingProduct.createAt); // Chuyển đổi thành kiểu ngày
                $scope.editingProduct.deleteAt = new Date($scope.editingProduct.deleteAt); // Chuyển đổi thành kiểu ngày
                $scope.editingProduct.updateAt = new Date($scope.editingProduct.updateAt); // Chuyển đổi thành kiểu ngày
                $scope.isEditing = true;

                $location.path("/product-form").search({id: productId, data: angular.toJson(resp.data)});
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    if ($routeParams.data) {
        $scope.editingProduct = angular.fromJson($routeParams.data);
        $scope.editingProduct.manufactureDate = new Date($scope.editingProduct.manufactureDate); // Chuyển đổi thành kiểu ngày
        $scope.editingProduct.createAt = new Date($scope.editingProduct.createAt); // Chuyển đổi thành kiểu ngày
        $scope.editingProduct.deleteAt = new Date($scope.editingProduct.deleteAt); // Chuyển đổi thành kiểu ngày
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
        if ($scope.editingProduct.price && $scope.editingProduct.discount) {
            var price = $scope.editingProduct.price;
            var discount = $scope.editingProduct.discount.value;

            var priceDiscount = price - (price * discount / 100);
            $scope.editingProduct.priceDiscount = priceDiscount;
        } else {
            $scope.editingProduct.priceDiscount = null;
        }
    };


    $scope.resetForm = function () {
        $scope.editingProduct = {};
        $scope.isEditing = false;
    };

    $scope.loadProducts();
});
