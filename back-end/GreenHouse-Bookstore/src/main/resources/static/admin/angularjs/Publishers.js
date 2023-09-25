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
        .catch((Error) => {
          console.log("Error", Error);
        });
    };
  
    $scope.savePublisher = function () {
      var publisher = {
        publisherId: $scope.editingPublisher.publisherId || "",
        publisherName: $scope.editingPublisher.publisherName || "",
        description: $scope.editingPublisher.description || "",
        address: $scope.editingPublisher.address || "",
        email: $scope.editingPublisher.email || "",
        image: $scope.editingPublisher.image || "",
      };
  
      if ($scope.isEditing) {
        var url = `${host}/${publisher.publisherId}`;
        $http
          .put(url, publisher)
          .then((resp) => {
            $scope.loadPublishers();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Cập nhật nhà xuất bản ${publisher.publisherId}`,
            });
          })
          .catch((Error) => {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Cập nhật nhà xuất bản ${publisher.publisherId} thất bại`,
            });
          });
      } else {
        var url = `${host}`;
        $http
          .post(url, publisher)
          .then((resp) => {
            $scope.loadPublishers();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Thêm nhà xuất bản ` + publisher.publisherName,
            });
          })
          .catch((Error) => {
            console.log(Error.data);
            if (Error.data) {
              Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: `Thêm nhà xuất bản thất bại`,
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
          $location.path("/publisher-form").search({ id: publisherId, data: angular.toJson(resp.data) });
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
        .catch((Error) => {
          if (Error.status === 409) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Nhà xuất bản ${key} đang được sử dụng và không thể xóa.`,
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
    
    
    $scope.resetForm = function () {
      $scope.editingPublisher = {};
      $scope.isEditing = false;
    };
  
    $scope.loadPublishers();
  });
  