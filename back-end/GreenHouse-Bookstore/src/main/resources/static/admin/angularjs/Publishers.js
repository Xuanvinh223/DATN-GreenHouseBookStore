app.controller("PublishersController", function ($scope, $location, $routeParams, $http) {
  let host = "http://localhost:8081/rest/publishers";
  $scope.editingPublisher = {};
  $scope.isEditing = false;

  $scope.publishers = [];

  $scope.loadPublishers = function () {
    var url = `${host}`;
    $http
      .get(url)
      .then((resp) => {
        $scope.publishers = resp.data;
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  $scope.savePublisher = function (publisherId) {
    var formData = new FormData();
    var fileInput = document.getElementById("fileInput");

    if (fileInput && fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    formData.append(
      "publisherJson",
      JSON.stringify({
        publisherId: $scope.editingPublisher.publisherId || "",
        publisherName: $scope.editingPublisher.publisherName || "",
        description: $scope.editingPublisher.description || "",
        address: $scope.editingPublisher.address || "",
        email: $scope.editingPublisher.email || "",
        image: $scope.editingPublisher.image || "",
      })
    );

    if ($scope.isEditing) {
      var url = `${host}/${$scope.editingPublisher.publisherId}`;
      $http
        .put(url, formData, {
          transformRequest: angular.identity,
          headers: { "Content-Type": undefined },
        })
        .then((resp) => {
          $scope.loadPublishers();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Cập nhật nhà xuất bản ${publisherId}`,
          });
          $scope.clearImage(); // Xóa ảnh đại diện sau khi cập nhật
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Cập nhật nhà xuất bản ${publisherId} thất bại`,
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
          $scope.loadPublishers();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Thêm nhà xuất bản ${publisherId}  ` ,
          });
          $scope.clearImage(); // Xóa ảnh đại diện sau khi thêm
        })
        .catch((error) => {
          console.log(error.data);
          if (error.data) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Thêm nhà xuất bản ${publisherId} thất bại`,
            });
          }
        });
    }
  };

  $scope.editPublisherAndRedirect = function (publisherId) {
    var url = `${host}/${publisherId}`;
    $http
      .get(url)
      .then(function (resp) {
        $scope.editingPublisher = angular.copy(resp.data);
        $scope.isEditing = true;

        // Chuyển hướng đến trang chỉnh sửa thông tin nhà xuất bản và truyền dữ liệu nhà xuất bản.
        // Sử dụng $location.search để thiết lập tham số trong URL.
        $location
          .path("/publisher-form")
          .search({ id: publisherId, data: angular.toJson(resp.data) });
      })
      .catch(function (error) {
        console.log("Error", error);
      });
  };

  // Kiểm tra xem có tham số data trong URL không.
  if ($routeParams.data) {
    // Parse dữ liệu từ tham số data và gán vào editingPublisher.
    $scope.editingPublisher = angular.fromJson($routeParams.data);
    $scope.isEditing = true;
  }

  $scope.deletePublisher = function (publisherId) {
    var url = `${host}/${publisherId}`;

    $http
      .delete(url)
      .then((resp) => {
        $scope.loadPublishers();
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `Xóa nhà xuất bản ${publisherId} thành công`,
        });
      })
      .catch((error) => {
        if (error.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Nhà xuất bản mã ${key} đang được sử dụng và không thể xóa.`,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Xóa nhà xuất bản ${publisherId} thất bại`,
          });
        }
      });
  };

  $scope.clearImage = function () {
    $scope.editingPublisher.image = ""; // Xóa đường dẫn ảnh đại diện
    var imageElement = document.getElementById("uploadedImage");
    imageElement.src = ""; // Xóa hiển thị ảnh đại diện
    var fileInput = document.getElementById("fileInput");
    fileInput.value = null; // Đặt giá trị của input file thành null để xóa tệp đã chọn
  };

  $scope.resetForm = function () {
    $scope.editingPublisher = {};
    $scope.isEditing = false;
    $scope.clearImage(); // Xóa ảnh đại diện khi làm mới form
  };

  $scope.loadPublishers();
});
