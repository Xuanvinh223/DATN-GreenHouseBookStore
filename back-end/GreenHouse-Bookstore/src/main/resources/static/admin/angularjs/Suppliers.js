app.controller('SuppliersController', function ($scope, $location, $routeParams, $http) {
    let host = "http://localhost:8081/rest/suppliers";
    $scope.editingSupplier = {};
    $scope.isEditing = false;
  
    $scope.suppliers = [];
  
    $scope.loadSuppliers = function () {
      var url = `${host}`;
      $http
        .get(url)
        .then((resp) => {
          $scope.suppliers = resp.data;
        })
        .catch((Error) => {
          console.log("Error", Error);
        });
    };
  
    $scope.saveSupplier = function () {
      var supplier = {
        supplierId: $scope.editingSupplier.supplierId || "",
        supplierName: $scope.editingSupplier.supplierName || "",
        description: $scope.editingSupplier.description || "",
        address: $scope.editingSupplier.address || "",
        phone: $scope.editingSupplier.phone || "",
        email: $scope.editingSupplier.email || "",
        image: $scope.editingSupplier.image || "",
      };
  
      if ($scope.isEditing) {
        var url = `${host}/${supplier.supplierId}`;
        $http
          .put(url, supplier)
          .then((resp) => {
            $scope.loadSuppliers();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Cập nhật nhà cung cấp ${supplier.supplierId}`,
            });
          })
          .catch((Error) => {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Cập nhật nhà cung cấp ${supplier.supplierId} thất bại`,
            });
          });
      } else {
        var url = `${host}`;
        $http
          .post(url, supplier)
          .then((resp) => {
            $scope.loadSuppliers();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Thêm nhà cung cấp ` + supplier.supplierName,
            });
          })
          .catch((Error) => {
            console.log(Error.data);
            if (Error.data) {
              Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: `Thêm nhà cung cấp thất bại`,
              });
            }
          });
      }
    };
  
    $scope.editSupplierAndRedirect = function (supplierId) {
      var url = `${host}/${supplierId}`;
      $http
        .get(url)
        .then(function (resp) {
          $scope.editingSupplier = angular.copy(resp.data);
          $scope.isEditing = true;
  
          // Chuyển hướng đến trang chỉnh sửa thông tin nhà cung cấp và truyền dữ liệu nhà cung cấp.
          // Sử dụng $location.search để thiết lập tham số trong URL.
          $location.path("/supplier-form").search({ id: supplierId, data: angular.toJson(resp.data) });
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    };
  
    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
      // Parse dữ liệu từ tham số data và gán vào editingSupplier.
      $scope.editingSupplier = angular.fromJson($routeParams.data);
      $scope.isEditing = true;
    }
  
    $scope.deleteSupplier = function (supplierId) {
      var url = `${host}/${supplierId}`;
  
      $http
        .delete(url)
        .then((resp) => {
          $scope.loadSuppliers();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Xóa nhà cung cấp ${supplierId} thành công`,
          });
        })
        .catch((Error) => {
          if (Error.status === 409) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Nhà cung cấp ${key} đang được sử dụng và không thể xóa.`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Xóa nhà cung cấp ${supplierId} thất bại`,
            });
          }
        });
    };
  
    $scope.resetForm = function () {
      $scope.editingSupplier = {};
      $scope.isEditing = false;
    };
  
    $scope.loadSuppliers();
});
