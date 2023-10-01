app.controller("AuthorController", function ($scope, $location, $routeParams, $http) {
  $scope.$on('$routeChangeSuccess', function (event, current, previous) {
    $scope.page.setTitle(current.$$route.title || ' Quản Lý Tác Giả');
  });
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
      .catch((error) => {
        console.log("Error", error);
      });
  };
  // Hàm tạo id ngẫu nhiên với "AU00" và 3 số ngẫu nhiên
  function generateRandomId() {
    let result = "AU00";
    for (let i = 0; i < 3; i++) {
      result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
    }
    return result;
  }

  $scope.saveAuthor = function (authorId) {
    var formData = new FormData();
    var fileInput = document.getElementById("fileInput");

    if (fileInput && fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    // Tạo id ngẫu nhiên nếu đang thêm tác giả mới
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

    if ($scope.isEditing) {
      var url = `${host}/${$scope.editingAuthor.authorId}`;
      $http
          .put(url, formData, {
            transformRequest: angular.identity,
            headers: {"Content-Type": undefined},
          })
          .then((resp) => {
            $scope.loadAuthors();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Cập nhật tác giả ${authorId} thành công`,
            });
            $scope.clearImage(); // Xóa ảnh đại diện sau khi cập nhật
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Cập nhật tác giả ${authorId} thất bại`,
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
            $scope.loadAuthors();
            $scope.resetForm();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Thêm tác giả  ${authorId} thành công `,
            });
            $scope.clearImage(); // Xóa ảnh đại diện sau khi thêm
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
    }
  };
  $scope.$watch('nationalities', function () {
    // Chọn thẻ select và thêm tính năng tìm kiếm bằng jQuery
    $('#nationSelect').select2({
      placeholder: 'Tìm kiếm quốc tịch',
      allowClear: true // Cho phép xóa lựa chọn
    });

    // Lắng nghe sự kiện thay đổi của Select2 để cập snhật giá trị trong biến $scope.editingAuthor.nation
    $('#nationSelect').on('change', function () {
      $scope.editingAuthor.nation = $(this).val();
    });
  });
  

  // Cập nhật service để lấy danh sách quốc tịch từ API
  function getNationalities() {
    var url = 'https://restcountries.com/v3.1/all?fields=name'; // Đường dẫn API quốc tịch
    return $http.get(url);
  }
  $scope.nationalities = [];

  getNationalities()
  .then(function (resp) {
    $scope.nationalities = resp.data.map
    (function (nationality) {
      return nationality.name.common; // Lấy tên quốc tịch
    });
    console.log($scope.nationalities); // In danh sách quốc gia ra để kiểm tra
  })
  .catch(function (error) {
    console.log('Error', error);
  });



  $scope.editAuthorAndRedirect = function (authorId) {
    var url = `${host}/${authorId}`;
    $http
      .get(url)
      .then(function (resp) {
        $scope.editingAuthor = angular.copy(resp.data);
        $scope.isEditing = true;

        // Chuyển hướng đến trang chỉnh sửa thông tin tác giả và truyền dữ liệu tác giả.
        // Sử dụng $location.search để thiết lập tham số trong URL.
        $location
            .path("/author-form")
            .search({id: authorId, data: angular.toJson(resp.data)});
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
      .catch((error) => {
        if (error.status === 409) {
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

  $scope.clearImage = function () {
    $scope.editingAuthor.image = ""; // Xóa đường dẫn ảnh đại diện
    $scope.editingAuthor.nation = ""; // Xóa giá trị quốc tịch
    $('#nationSelect').val('').trigger('change'); // Xóa giá trị đã chọn trong Select2  
    var imageElement = document.getElementById("uploadedImage");
    imageElement.src = ""; // Xóa hiển thị ảnh đại diện
    var fileInput = document.getElementById("fileInput");
    fileInput.value = null; // Đặt giá trị của input file thành null để xóa tệp đã chọn
  };

  $scope.resetForm = function () {
    $scope.editingAuthor = {};
    $scope.isEditing = false;
    $scope.clearImage(); // Xóa ảnh đại diện khi làm mới form
  };

  $scope.loadAuthors();
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
