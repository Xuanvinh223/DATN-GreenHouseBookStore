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
        .catch((Error) => {
          console.log("Error", Error);
        });
    };
  
    $scope.saveBrand = function () {
      var brand = {
        brandId: $scope.editingBrand.brandId || "",
        brandName: $scope.editingBrand.brandName || "",
        countryOfOrigin: $scope.editingBrand.countryOfOrigin || "",
        logo: $scope.editingBrand.logo || "",
      };
  
      if ($scope.isEditing) {
        var url = `${host}/${brand.brandId}`;
        $http
          .put(url, brand)
          .then((resp) => {
            $scope.loadBrand();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Cập nhật thương hiệu ${brand.brandName}`,
            });
          })
          .catch((Error) => {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Cập nhật tác giả ${brand.brandName} thất bại`,
            });
          });
      } else {
        var url = `${host}`;
        $http
          .post(url, brand)
          .then((resp) => {
            $scope.loadBrand();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Thêm thương hiệu ` + brand.brandName,
            });
          })
          .catch((Error) => {
            console.log(Error.data);
            if (Error.data) {
              Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: `Thêm thương hiệu thất bại`,
              });
            }
          });
      }
    };
  
    $scope.editBrandAndRedirect = function (brandId) {
      var url = `${host}/${brandId}`;
      $http
        .get(url)
        .then(function (resp) {
          $scope.editingBrand = angular.copy(resp.data);
          $scope.isEditing = true;
          // Sử dụng $location.search để thiết lập tham số trong URL.
          $location.path("/brand-form").search({ id: brandId, data: angular.toJson(resp.data) });
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    };
  
    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
      // Parse dữ liệu từ tham số data và gán vào editingAuthor.
      $scope.editingBrand = angular.fromJson($routeParams.data);
      $scope.isEditing = true;
    }

    $scope.deleteBrand = function (brandId) {
      var url = `${host}/${brandId}`;
      
      // Sử dụng $http để gửi yêu cầu DELETE đến API
      $http
        .delete(url)
        .then((resp) => {
          $scope.loadBrand(); // Nạp lại danh sách thương hiệu sau khi xóa
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Xóa thương hiệu ${brandId} thành công`,
          });
        })
        .catch((Error) => {
          if (Error.status === 409) {
            // Kiểm tra mã trạng thái lỗi
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Thương hiệu mã ${key} đang được sử dụng và không thể xóa.`,
            });
          } else
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Xóa thương hiệu ${brandId} thất bại`,
          });
        });
    };
    
  
    $scope.cancelEdit = function () {
      $scope.resetForm();
    };
  
    $scope.resetForm = function () {
      $scope.editingBrand = {};
      $scope.isEditing = false;
    };
  
    $scope.loadBrand();
  });
  