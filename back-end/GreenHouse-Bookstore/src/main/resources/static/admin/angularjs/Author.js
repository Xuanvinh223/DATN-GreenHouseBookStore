app.controller("AuthorController", function ($scope, $location, $routeParams, $http) {
  let host = "http://localhost:8081/rest/authors";
  $scope.editingAuthor = {};
  $scope.isEditing = false;

  $scope.authors = [];

  $scope.loadAuthors = function () {
    var url = `${host}`;
    $http
      .get(url)
      .then((resp) => {
        $scope.authors = resp.data;
      })
      .catch((Error) => {
        console.log("Error", Error);
      });
  };

  $scope.saveAuthor = function () {
    var author = {
      authorId: $scope.editingAuthor.authorId || "",
      authorName: $scope.editingAuthor.authorName || "",
      gender: $scope.editingAuthor.gender || false,
      nation: $scope.editingAuthor.nation || "",
      image: $scope.editingAuthor.image || "",
    };

    if ($scope.isEditing) {
      var url = `${host}/${author.authorId}`;
      $http
        .put(url, author)
        .then((resp) => {
          $scope.loadAuthors();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Cập nhật tác giả ${author.authorId}`,
          });
        })
        .catch((Error) => {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Cập nhật tác giả ${author.authorId} thất bại`,
          });
        });
    } else {
      var url = `${host}`;
      $http
        .post(url, author)
        .then((resp) => {
          $scope.loadAuthors();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Thêm tác giả ` + author.authorName,
          });
        })
        .catch((Error) => {
          console.log(Error.data);
          if (Error.data) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Thêm tác giả thất bại`,
            });
          }
        });
    }
  };

  $scope.editAuthorAndRedirect = function (authorId) {
    var url = `${host}/${authorId}`;
    $http
      .get(url)
      .then(function (resp) {
        $scope.editingAuthor = angular.copy(resp.data);
        $scope.isEditing = true;

        // Chuyển hướng đến trang chỉnh sửa thông tin tác giả và truyền dữ liệu tác giả.
        // Sử dụng $location.search để thiết lập tham số trong URL.
        $location.path("/author-form").search({ id: authorId, data: angular.toJson(resp.data) });
      })
      .catch(function (error) {
        console.log("Error", error);
      });
  };

  // Kiểm tra xem có tham số data trong URL không.
  if ($routeParams.data) {
    // Parse dữ liệu từ tham số data và gán vào editingAuthor.
    $scope.editingAuthor = angular.fromJson($routeParams.data);
    $scope.isEditing = true;
  }
  $scope.deleteAuthor = function (authorId) {
    var url = `${host}/${authorId}`;

    $http
      .delete(url)
      .then((resp) => {
        $scope.loadAuthors();
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `Xóa tác giả ${authorId} thành công`,
        });
      })
      .catch((Error) => {
        if (Error.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Sản phẩm mã ${key} đang được sử dụng và không thể xóa.`,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Xóa tác giả ${authorId} thất bại`,
          });
        }
      });
  };

  $scope.cancelEdit = function () {
    $scope.resetForm();
  };

  $scope.resetForm = function () {
    $scope.editingAuthor = {};
    $scope.isEditing = false;
  };

  $scope.loadAuthors();
});
