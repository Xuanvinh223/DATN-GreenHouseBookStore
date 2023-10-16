app.controller("PublishersController", PublishersController);

function PublishersController($scope, $location, $routeParams, $http) {
  $scope.$on('$routeChangeSuccess', function (event, current, previous) {
    $scope.page.setTitle(current.$$route.title || ' Quản Lý nhà xuất bản');
      $scope.loadPublishers();
  });

    $scope.editingPublisher = {};
    $scope.isEditing = false;
    $scope.publishers = [];
    $scope.searchText = "";

    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    let host = "http://localhost:8081/rest/publishers";
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang
    $scope.currentPage = 1; // Trang hiện tại
    $scope.itemsPerPage = 5; // Số mục hiển thị trên mỗi trang
    $scope.totalItems = $scope.publishers.length; // Tổng số mục
    $scope.maxSize = 5; // Số lượng nút phân trang tối đa hiển thị
    $scope.reverseSort = false; // Sắp xếp tăng dần

    // Hàm tính toán số trang dựa trên số lượng mục và số mục trên mỗi trang
    $scope.getNumOfPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm chuyển đổi trang
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.calculateRange = function () {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + 1;
        var endIndex = $scope.currentPage * $scope.itemsPerPage;

        if (endIndex > $scope.totalItems) {
            endIndex = $scope.totalItems;
        }

        return startIndex + ' đến ' + endIndex + ' trên tổng số ' + $scope.totalItems + ' mục';
    };

    $scope.loadPublishers = function () {
        var url = `${host}`;
        $http.get(url).then(resp => {
            $scope.originalPublishers = $scope.publishers;
            $scope.publishers = resp.data;
            console.log("success", resp.data);
            $scope.totalItems = $scope.publishers.length;
        }).catch(error => {
            console.log("Error", error);
        });
    }

    $scope.searchData = function () {
        // Lọc danh sách gốc bằng searchText
        $scope.publishers = $scope.originalPublishers.filter(function (publisher) {
            // Thực hiện tìm kiếm trong các thuộc tính cần thiết của item
            return (
                publisher.publisherId.toString().includes($scope.searchText) || publisher.publisherName.toLowerCase().includes($scope.searchText.toLowerCase()) || publisher.email.toString().includes($scope.searchText)
            );
        });
        $scope.totalItems = $scope.searchText ? $scope.publishers.length : $scope.originalPublishers.length;
        ;
        $scope.setPage(1);
    };


    // Lưu thông tin nhà xuất bản
    $scope.savePublisher = function (publisherId) {
        $scope.errorMessages = {
            publisherId: '',
            publisherName: '',
            address: '',
            email: ''
        };

    var formData = new FormData();
    var fileInput = document.getElementById("fileInput");
    if (fileInput && fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }
    var publisherId = $scope.editingPublisher.publisherId;
    var publisherName = $scope.editingPublisher.publisherName;
    var address = $scope.editingPublisher.address;
    var email = $scope.editingPublisher.email;

    // Kiểm tra bỏ trống mã nxb
    if (!publisherId) {
      $scope.errorMessages.publisherId = 'Vui lòng nhập mã nhà xuất bản';
      return;
    }
    // Kiểm tra bỏ trống tên nxb
    if (!publisherName) {
      $scope.errorMessages.publisherName = 'Vui lòng nhập tên nhà xuất bản';
      return;
    }
    // Kiểm tra bỏ trống nxb
    if (!address) {
      $scope.errorMessages.address = 'Vui lòng nhập địa chỉ nhà xuất bản';
      return;
    }
    // Kiểm tra bỏ trống nxb
    if (!email) {
      $scope.errorMessages.email = 'Vui lòng nhập email nhà xuất bản';
      return;
    }

    // Kiểm tra định dạng mã
    var publisherIdRegex = /^[A-Z0-9]{4,}$/;
    if (!publisherIdRegex.test(publisherId)) {
      $scope.errorMessages.publisherId = 'Mã nhà xuất bản phải chứa ít nhất 4 ký tự và chỉ được điền kí tự HOA và số';
      return;
    }

    // Kiểm tra trùng lặp publisherId trước khi thêm
    if (!$scope.isEditing) {
      var existingPublisher = $scope.publishers.find(function (publisher) {
        return publisher.publisherId === $scope.editingPublisher.publisherId;
      });

      if (existingPublisher) {
        // Gán thông báo lỗi vào $scope.errorMessages.publisherId
        $scope.errorMessages.publisherId = `Mã Nhà xuất bản "${$scope.editingPublisher.publisherId}" đã tồn tại. Vui lòng chọn mã khác.`;
        return; // Không tiếp tục lưu nếu có lỗi
      }
    }

    // Kiểm tra trùng lặp publisherName trước khi thêm
    var existingPublisherName = $scope.publishers.find(function (publisher) {
      return (
        publisher.publisherName === $scope.editingPublisher.publisherName &&
        publisher.publisherId !== $scope.editingPublisher.publisherId
      );
    });
    if (existingPublisherName) {
      // Hiển thị thông báo lỗi nếu tên nhà xuất bản đã tồn tại
      $scope.errorMessages.publisherName = `Tên Nhà xuất bản "${$scope.editingPublisher.publisherName}" đã tồn tại. Vui lòng chọn tên khác.`;
      return; // Không tiếp tục lưu nếu có lỗi
    }

    // Kiểm tra định dạng email Gmail
    function isGmail(email) {
      var emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      return emailRegex.test(email);
    }
    if (!isGmail($scope.editingPublisher.email)) {
      // Hiển thị thông báo lỗi nếu email không đúng định dạng Gmail
      $scope.errorMessages.email = `Email "${$scope.editingPublisher.email}" không đúng định dạng Gmail. Vui lòng kiểm tra lại.`;
      return; // Không tiếp tục lưu nếu có lỗi
    }

    // Kiểm tra trùng lặp email trước khi thêm
    var existingEmail = $scope.publishers.find(function (publisher) {
      return (
        publisher.email === $scope.editingPublisher.email &&
        publisher.publisherId !== $scope.editingPublisher.publisherId
      );
    });
    if (existingEmail) {
      // Hiển thị thông báo lỗi nếu email đã tồn tại
      $scope.errorMessages.email = `Email "${$scope.editingPublisher.email}" đã tồn tại. Vui lòng chọn email khác.`;
      return; // Không tiếp tục lưu nếu có lỗi
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
      // Sử dụng hộp thoại xác nhận từ thư viện Swal
      Swal.fire({
        title: 'Xác nhận cập nhật',
        text: `Bạn có muốn cập nhật nhà xuất bản "${publisherId}" không?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
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
                text: `Cập nhật nhà xuất bản "${publisherId}" thành công`,
              });
              $scope.clearImage(); // Xóa ảnh đại diện sau khi cập nhật
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: `Cập nhật nhà xuất bản "${publisherId}" thất bại`,
              });
            });
        } else {
          // Nếu người dùng chọn Hủy, bạn có thể thực hiện hành động nào đó, hoặc không làm gì cả.
          // Ví dụ: không thực hiện cập nhật và trở lại biểu mẫu.
        }
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
            text: `Thêm nhà xuất bản "${publisherId}"`,
          });
          $scope.clearImage(); // Xóa ảnh đại diện sau khi thêm
        })
        .catch((error) => {
          console.log(error.data);
          if (error.data) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Thêm nhà xuất bản "${publisherId}" thất bại`,
            });
          }
        });
    }
  };

  // Chỉnh sửa thông tin nhà xuất bản và chuyển hướng
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

  // Xóa nhà xuất bản
  $scope.deletePublisher = function (publisherId) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: `Bạn có muốn xóa nhà xuất bản "${publisherId}" không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        var url = `${host}/${publisherId}`;
        $http
          .delete(url)
          .then((resp) => {
            $scope.loadPublishers();
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Xóa nhà xuất bản "${publisherId}" thành công`,
            });
          })
          .catch((error) => {
            if (error.status === 409) {
              Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: `Nhà xuất bản mã "${publisherId}" đang được sử dụng và không thể xóa.`,
              });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Thất bại",
                    text: `Xóa nhà xuất bản "${publisherId}" thất bại`,
                });
            }
          });
      }
    });
  };

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

    // Xóa ảnh đại diện và làm mới form
  $scope.clearImage = function () {
    $scope.editingPublisher.image = "";
    var imageElement = document.getElementById("uploadedImage");
    imageElement.src = "";
    var fileInput = document.getElementById("fileInput");
    fileInput.value = null;
  };

  // Làm mới form
    $scope.resetForm = function () {
        $scope.editingPublisher = {};
        $scope.isEditing = false;
        $scope.clearImage(); // Xóa ảnh đại diện khi làm mới form
        $location.search('id', null);
        $location.search('data', null);

        // Sau khi xóa, chuyển hướng lại đến trang /flashsale-form
        $location.path('/publisher-form');
    };
  // Sử dụng $location.search() để xóa tham số "id" và "data" khỏi URL


    // Load danh sách nhà xuất bản khi controller được khởi tạo
  $scope.loadPublishers();
}
