app.controller("brandController", function ($scope, $location, $routeParams, $http) {
    let host = "http://localhost:8081/rest/brand"; // Thay đổi địa chỉ URL nếu cần
    $scope.editingBrand = {};
    $scope.isEditing = false;

    $scope.brands = [];

    $scope.loadBrand = function () {
        var url = `${host}`;
        $http
            .get(url)
            .then((resp) => {
                $scope.brands = resp.data;
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };


    $scope.saveBrand = function () {
        // Reset error messages
        $scope.errorMessages = {
            brandId: '',
            brandName: '',
            countryOfOrigin: ''
        };

        var formData = new FormData();
        var fileInput = document.getElementById("fileInput");
        var brandId = $scope.editingBrand.brandId;
        var brandName = $scope.editingBrand.brandName;
        var countryOfOrigin = $scope.editingBrand.countryOfOrigin;

        // Kiểm tra BrandId
        if (!brandId) {
            $scope.errorMessages.brandId = 'Vui lòng không bỏ trống thông tin thương hiệu';
            return;
        }

        // Kiểm tra BrandName
        if (!brandName) {
            $scope.errorMessages.brandName = 'Vui lòng không bỏ trống thông tin tên thương hiệu';
            return;
        }

        // Kiểm tra CountryOfOrigin
        if (!countryOfOrigin) {
            $scope.errorMessages.countryOfOrigin = 'Vui lòng không bỏ trống thông tin nơi xuất xứ';
            return;
        }

        // Kiểm tra ID thương hiệu
        var brandIdRegex = /^[A-Z0-9]{4,}$/;
        if (!brandIdRegex.test(brandId)) {
            $scope.errorMessages.brandId = 'ID thương hiệu phải chứa ít nhất 4 ký tự và chỉ được điền kí tự HOA và số';
            return;
        }

        if (fileInput && fileInput.files.length > 0) {
            formData.append("image", fileInput.files[0]);
        }

        formData.append("brandJson", JSON.stringify({
            brandId: brandId,
            brandName: brandName,
            countryOfOrigin: countryOfOrigin,
            logo: $scope.editingBrand.logo || ""
        }));

        var url = $scope.isEditing ? `${host}/${brandId}` : host;

        $http({
            method: $scope.isEditing ? 'PUT' : 'POST',
            url: url,
            data: formData,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        })
            .then(function (resp) {
                console.log(resp);
                $scope.loadBrand();
                $scope.resetForm();
                var action = $scope.isEditing ? 'Cập nhật' : 'Thêm';
                showSuccess(`${action} thương hiệu ${resp.data.brandId}`);
                $scope.clearImage(); // Xóa ảnh đại diện sau khi cập nhật hoặc thêm
            })
            .catch(function (error) {
                var action = $scope.isEditing ? 'Cập nhật' : 'Thêm';
                showError(`${action} thương hiệu thất bại`);
            });
    };


    $scope.checkDuplicateBrandId = function (brandId) {
        // Kiểm tra trùng lặp username
        var existingbrandId = $scope.brand.find(function (brand) {
            return brand.brandId === brandId;
        });

        if (existingbrandId) {
            showError("ID thương hiệu đã tồn tại.");
            return true; // Đã tồn tại
        }

        return false; // Chưa tồn tại
    };


    $scope.editBrandAndRedirect = function (brandId) {
        var url = `${host}/${brandId}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.editingBrand = angular.copy(resp.data);
                $scope.isEditing = true;

                // Chuyển hướng đến trang chỉnh sửa thông tin thương hiệu và truyền dữ liệu thương hiệu.
                // Sử dụng $location.search để thiết lập tham số trong URL.
                $location
                    .path("/brand-form")
                    .search({
                        id: brandId,
                        data: angular.toJson(resp.data)
                    });
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào editingBrand.
        $scope.editingBrand = angular.fromJson($routeParams.data);
        $scope.isEditing = true;
    }

    $scope.deleteBrand = function (brandId) {
        var url = `${host}/${brandId}`;
        Swal.fire({
            title: "Bạn chắc chắn?",
            text: "Dữ liệu sẽ bị xóa vĩnh viễn.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                // Sử dụng $http để gửi yêu cầu DELETE đến API
                $http.delete(url)
                    .then((resp) => {
                        $scope.loadBrand(); // Nạp lại danh sách thương hiệu sau khi xóa
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: `Xóa thương hiệu ${brandId} thành công`,
                        });
                    })
                    .catch((error) => {
                        if (error.status === 409) {
                            // Kiểm tra mã trạng thái lỗi
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Thương hiệu mã ${brandId} đang được sử dụng và không thể xóa.`,
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Xóa thương hiệu ${brandId} thất bại`,
                            });
                        }
                    });
            }
        });
    };


    $scope.resetForm = function () {
        $scope.editingBrand = {};
        $scope.isEditing = false;
        $scope.clearImage();
    };

    $scope.clearImage = function () {
        $scope.editingBrand.logo = ""; // Xóa đường dẫn ảnh đại diện
        var imageElement = document.getElementById("uploadedImage");
        imageElement.src = ""; // Xóa hiển thị ảnh đại diện
        var fileInput = document.getElementById("fileInput");
        fileInput.value = null; // Đặt giá trị của input file thành null để xóa tệp đã chọn
    };

    $scope.loadBrand();
});


// Hiển thị ảnh tải lên khi chọn tệp
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