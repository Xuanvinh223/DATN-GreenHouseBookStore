app.controller("AccountController", function ($scope, $location, $routeParams, $http) {
    // Thay đổi địa chỉ URL nếu cần
    $scope.editingAccounts = {};
    $scope.isEditing = false;

    $scope.accounts = [];
    $scope.searchText = "";

    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    let host = "http://localhost:8081/rest/accounts";
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang
    $scope.currentPage = 1; // Trang hiện tại
    $scope.itemsPerPage = 5; // Số mục hiển thị trên mỗi trang
    $scope.totalItems = $scope.accounts.length; // Tổng số mục
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

    $scope.loadAccount = function () {
        var url = `${host}`;
        $http.get(url).then(resp => {
            $scope.accounts = resp.data;
            $scope.originalaccounts = $scope.accounts;

            console.log("success", resp.data);
            $scope.totalItems = $scope.accounts.length;
        }).catch(error => {
            console.log("Error", error);
        });
    }

    $scope.searchData = function () {
        // Lọc danh sách gốc bằng searchText
        $scope.accounts = $scope.originalaccounts.filter(function (account) {
            // Thực hiện tìm kiếm trong các thuộc tính cần thiết của item
            if (account.fullname) {
                return (
                    account.username.toString().includes($scope.searchText) ||
                    account.fullname.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                    account.email.toString().includes($scope.searchText) ||
                    account.phone.toString().includes($scope.searchText)
                );
            }
            return false; // Bỏ qua mục này nếu fullname là null hoặc undefined
        });
        $scope.totalItems = $scope.searchText ? $scope.accounts.length : $scope.originalaccounts.length;
        $scope.setPage(1);
    };


    $scope.saveAccounts = function () {
        $scope.errorMessages = {
            username: '',
            password: '',
            fullname: '',
            email: '',
            phone: '',
            birthday: ''
        };
        var formData = new FormData();
        var fileInput = document.getElementById("fileInput");
        var username = $scope.editingAccounts.username;
        var password = $scope.editingAccounts.password;
        var fullname = $scope.editingAccounts.fullname;
        var email = $scope.editingAccounts.email;
        var phone = $scope.editingAccounts.phone;
        var birthday = $scope.editingAccounts.birthday;
        // Kiểm tra xem các trường bắt buộc có được điền không
        if (!username) {
            $scope.errorMessages.username = 'Vui lòng không bỏ trống tên tài khoản';
            return;
        }

        if (!fullname) {
            $scope.errorMessages.fullname = 'Vui lòng không bỏ trống họ và tên';
            return;
        }
        if (!password) {
            $scope.errorMessages.password = 'Vui lòng không bỏ trống mật khẩu';
            return;
        }
        if (!email) {
            $scope.errorMessages.email = 'Vui lòng không bỏ trống email';
            return;
        }
        if (!phone) {
            $scope.errorMessages.phone = 'Vui lòng không bỏ trống số điện thoại';
            return;
        }
        if (birthday) {
            var currentDate = new Date();
            var selectedDate = new Date(birthday);

            if (selectedDate > currentDate) {
                $scope.errorMessages.birthday = 'Ngày sinh không được là ngày ở tương lai';
                return;
            }
        }

        // Kiểm tra tên tài khoản chỉ được nhập chữ và số
        var usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(username)) {
            $scope.errorMessages.username = 'Tên tài khoản chỉ được nhập chữ và số';
            return;
        }


        // Kiểm tra mật khẩu
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            $scope.errorMessages.password = 'Mật khẩu phải có ít nhất 6 kí tự, bao gồm kí tự hoa, kí tự đặc biệt và số';
            return;
        }

        // Kiểm tra số điện thoại là số Việt Nam
        var phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            $scope.errorMessages.phone = 'Số điện thoại không hợp lệ';
            return;
        }

        // Kiểm tra email đúng định dạng
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $scope.errorMessages.email = 'Địa chỉ email không hợp lệ';
            return;
        }
        if ($scope.checkDuplicateUsername(username) || $scope.checkDuplicateEmail(email)) {
            return; // Hiển thị thông báo lỗi đã tồn tại
        }

        if (fileInput && fileInput.files.length > 0) {
            formData.append("image", fileInput.files[0]);
        }

        formData.append("AccountJson", JSON.stringify({
            username: username,
            password: password,
            fullname: fullname,
            email: email,
            gender: $scope.editingAccounts.gender || false,
            birthday: $scope.editingAccounts.birthday || "",
            phone: phone,
            image: $scope.editingAccounts.image || "",
            active: $scope.editingAccounts.active || false
        }));

        var url = $scope.isEditing ? `${host}/${username}` : host;

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
                $scope.loadAccount();
                $scope.resetForm();
                var action = $scope.isEditing ? 'Cập nhật' : 'Thêm';
                showSuccess(`${action} tài khoản ${resp.data.username}`);
                $scope.clearImage(); // Xóa ảnh đại diện sau khi cập nhật hoặc thêm
            })
            .catch(function (error) {
                var action = $scope.isEditing ? 'Cập nhật' : 'Thêm';
                showError(`${action} tài khoản thất bại`);
            });
    };

    $scope.checkDuplicateUsername = function (username) {
        // Kiểm tra trùng lặp username
        var existingUsername = $scope.accounts.find(function (account) {
            return account.username === username;
        });

        if (existingUsername) {
            $scope.errorMessages.username = 'Tên tài khoản đã tồn tại.';
            return true; // Đã tồn tại
        }

        return false; // Chưa tồn tại
    };

    $scope.checkDuplicateEmail = function (email) {
        // Kiểm tra trùng lặp email
        var existingEmail = $scope.accounts.find(function (account) {
            return account.email === email;
        });

        if (existingEmail) {
            $scope.errorMessages.email = 'Email đã tồn tại.';
            return true; // Đã tồn tại
        }

        return false; // Chưa tồn tại
    };


    $scope.editAccountsAndRedirect = function (username) {
        var url = `${host}/${username}`;
        $http
            .get(url)
            .then(function (resp) {
                $scope.editingAccounts = angular.copy(resp.data);
                $scope.isEditing = true;

                // Chuyển hướng đến trang chỉnh sửa thông tin tài khoản và truyền dữ liệu tài khoản.
                // Sử dụng $location.search để thiết lập tham số trong URL.
                $location
                    .path("/account-form")
                    .search({
                        id: username,
                        data: angular.toJson(resp.data)
                    });
            })
            .catch(function (error) {
                console.log("Error", error);
            });
    };

    // Kiểm tra xem có tham số data trong URL không.
    if ($routeParams.data) {
        // Parse dữ liệu từ tham số data và gán vào editingAccount.
        $scope.editingAccounts = angular.fromJson($routeParams.data);
        $scope.isEditing = true;
    }

    $scope.deleteAccounts = function (username) {
        var url = `${host}/${username}`;
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
                        $scope.loadAccount(); // Nạp lại danh sách tài khoản iệu sau khi xóa
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: `Xóa tài khoản ${username} thành công`,
                        });
                    })
                    .catch((error) => {
                        if (error.status === 409) {
                            // Kiểm tra mã trạng thái lỗi
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Tài khoản ${username} đang được sử dụng và không thể xóa.`,
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Thất bại",
                                text: `Xóa tài khoản ${username} thất bại`,
                            });
                        }
                    });
            }
        });
    };

    $scope.resetForm = function () {
        $scope.editingAccounts = {};
        $scope.isEditing = false;
        $scope.clearImage();
    };

    $scope.clearImage = function () {
        $scope.editingAccounts.image = ""; // Xóa đường dẫn ảnh đại diện
        var imageElement = document.getElementById("uploadedImage");
        imageElement.src = ""; // Xóa hiển thị ảnh đại diện
        var fileInput = document.getElementById("fileInput");
        fileInput.value = null; // Đặt giá trị của input file thành null để xóa tệp đã chọn
    };

    $scope.formatDate = function (date) {
        if (date == null) {
            return "";
        }
        var formattedDate = new Date(date);
        var year = formattedDate.getFullYear();
        var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
        var day = formattedDate.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };


    $scope.loadAccount();
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

function showError(message) {
    Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: message,
    });
}

function showSuccess(message) {
    Swal.fire({
        icon: "success",
        title: "Thành công",
        text: message,
    });
}