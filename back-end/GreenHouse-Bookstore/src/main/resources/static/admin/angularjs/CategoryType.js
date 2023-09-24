app.controller("CategoryTypeController", function ($scope, $location, $routeParams, $http) {
    let host = "http://localhost:8081/rest/categoryTypes";
    $scope.editingCategoryType = {};
    $scope.isEditing = false;
  
    $scope.categoryTypes = [];
  
    $scope.loadCategoryTypes = function () {
      var url = `${host}`;
      $http
        .get(url)
        .then((resp) => {
          $scope.categoryTypes = resp.data;
        })
        .catch((Error) => {
          console.log("Error", Error);
        });
    };
  
    $scope.saveCategoryType = function () {
    // Tạo một id mới với kí tự "CT" và 3 kí tự ngẫu nhiên
    if (!$scope.isEditing) {
      $scope.editingCategoryType.typeId = "CT00" + generateRandomId(3);
    }

    var categoryType = {
      typeId: $scope.editingCategoryType.typeId,
      typeName: $scope.editingCategoryType.typeName || "",
      description: $scope.editingCategoryType.description || "",
    };

    if ($scope.isEditing) {
      var url = `${host}/${categoryType.typeId}`;
      $http
        .put(url, categoryType)
        .then((resp) => {
          $scope.loadCategoryTypes();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Cập nhật loại danh mục ${categoryType.typeId}`,
          });
        })
        .catch((Error) => {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Cập nhật loại danh mục ${categoryType.typeId} thất bại`,
          });
        });
    } else {
      var url = `${host}`;
      $http
        .post(url, categoryType)
        .then((resp) => {
          $scope.loadCategoryTypes();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Thêm loại danh mục ` + categoryType.typeName,
          });
        })
        .catch((Error) => {
          console.log(Error.data);
          if (Error.data) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Thêm loại danh mục thất bại`,
            });
          }
        });
    }
  };

// Hàm tạo mã ngẫu nhiên với 3 ký tự số
function generateRandomId() {
    let result = "";
    for (let i = 0; i < 3; i++) {
      result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
    }
    return result;
  }
  
  
    $scope.editCategoryTypeAndRedirect = function (typeId) {
      var url = `${host}/${typeId}`;
      $http
        .get(url)
        .then(function (resp) {
          $scope.editingCategoryType = angular.copy(resp.data);
          $scope.isEditing = true;
  
          // Chuyển hướng đến trang chỉnh sửa thông tin loại danh mục và truyền dữ liệu loại danh mục.
          // Sử dụng $location.search để thiết lập tham số trong URL.
          $location.path("/categorytype-form").search({ id: typeId, data: angular.toJson(resp.data) });
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    };
  
    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
      // Parse dữ liệu từ tham số data và gán vào editingCategoryType.
      $scope.editingCategoryType = angular.fromJson($routeParams.data);
      $scope.isEditing = true;
    }
    $scope.deleteCategoryType = function (typeId) {
      var url = `${host}/${typeId}`;
  
      $http
        .delete(url)
        .then((resp) => {
          $scope.loadCategoryTypes();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Xóa loại danh mục ${typeId} thành công`,
          });
        })
        .catch((Error) => {
          if (Error.status === 409) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Loại danh mục ${typeId} đang được sử dụng và không thể xóa.`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Xóa loại danh mục ${typeId} thất bại`,
            });
          }
        });
    };
  
    $scope.resetForm = function () {
      $scope.editingCategoryType = {};
      $scope.isEditing = false;
    };
  
    $scope.loadCategoryTypes();
  });
  