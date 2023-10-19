app.controller('accountController', accountController);

function accountController($http, $window, $scope, jwtHelper, $timeout) {
    let host = "http://localhost:8081/rest";

    var token = localStorage.getItem('token');
    if (token) {
        var decodedToken = jwtHelper.decodeToken(token);
        $scope.username = decodedToken.sub;
        console.log($scope.username);
        $scope.listAddress = [];// Khởi tạo biến để lưu trữ thông tin địa chỉ
        $scope.listProvince = []; // Danh sách các tỉnh/thành phố
        $scope.listDistrict = []; // Danh sách các quận/huyện tương ứng với tỉnh/thành phố được chọn
        $scope.listWard = []; // Danh sách các phường/xã tương ứng với quận/huyện được chọn
        $scope.modalContent = "";
        $scope.isAddingAddress = true; // Trạng thái mặc định khi ban đầu vào trang là "Thêm địa chỉ"
        $scope.isEditingAddress = false;
        $scope.address = {};

        // Gọi hàm loadData với tên người dùng hiện tại
        $scope.loadData = function (username) {
            var url = `${host}/address/${username}`;
            $http
                .get(url)
                .then(function (resp) {
                    var listAddress = resp.data.listAddress;
                    // Kiểm tra nếu danh sách không rỗng và có ít nhất một địa chỉ
                    if (Array.isArray(listAddress) && listAddress.length > 0) {
                        $scope.listAddress = listAddress;
                        console.log("Danh Sách Địa Chỉ", $scope.listAddress);
                    } else {
                        console.log("Không tìm thấy địa chỉ cho người dùng này.");
                    }
                })
                .catch(function (error) {
                    console.log("Error", error);
                });
        };

        $scope.getProvince = function () {
            var url = "https://provinces.open-api.vn/api/?depth=3";

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    $scope.listProvince = JSON.parse(xhr.responseText);
                    console.log('Danh sách quận/huyện:', $scope.listProvince);

                }
            };
            xhr.send();
        }

        $scope.getListDistrict = function () {
            var provinceCodeSelected = $scope.selectedProvinceCode;
            var selectedProvince = $scope.listProvince.find(function (province) {
                return province.code === provinceCodeSelected;
            });
            if (selectedProvince) {
                $scope.listDistrict = selectedProvince.districts;
            } else {
                $scope.listDistrict = [];
            }
            $timeout(function () {
                // Thực hiện cập nhật giao diện sau khi thay đổi $scope.listDistrict và $scope.listWard
            });

            console.log(provinceCodeSelected);
        };

        $scope.getListWard = function () {
            var districtCodeSelected = $scope.selectedDistrictCode;
            var selectedDistrict = $scope.listDistrict.find(function (district) {
                return district.code === districtCodeSelected;
            });
            if (selectedDistrict) {
                $scope.listWard = selectedDistrict.wards;
            } else {
                $scope.listWard = [];
            }
            $timeout(function () {
                // Thực hiện cập nhật giao diện sau khi thay đổi $scope.listDistrict và $scope.listWard
            });

            console.log(selectedDistrict);
        };
        //Hàm lưu địa chỉ
        $scope.saveAddress = function () {
            var check = $scope.checkErrors();
            if (check) {
                // Lấy tên của tỉnh, huyện và xã dựa trên mã code đã chọn
                var selectedProvince = $scope.listProvince.find(function (province) {
                    return province.code === $scope.selectedProvinceCode;
                });

                var selectedDistrict = $scope.listDistrict.find(function (district) {
                    return district.code === $scope.selectedDistrictCode;
                });

                var selectedWard = $scope.listWard.find(function (ward) {
                    return ward.code === $scope.selectedWardCode;
                });

                // Tạo một đối tượng Address từ dữ liệu nhập vào, bao gồm tên của tỉnh, huyện, xã và địa chỉ cụ thể
                var newAddress = {
                    id: $scope.address.id | null,
                    fullname: $scope.address.fullname,
                    phone: $scope.address.phone,
                    address: $scope.address.adr + ", " + selectedWard.name + ", " + selectedDistrict.name + ", " + selectedProvince.name,
                    username: $scope.username
                };

                var url = `${host}/profile_address`;
                $http.post(url, newAddress)
                    .then(function (resp) {
                        
                        $scope.loadData($scope.username);
                        console.log("Địa chỉ đã được lưu thành công:", resp.data);
                        $('#createAddressModal').modal('hide');
                        // Hiển thị modal "message"
                        if ($scope.isAddingAddress) {
                            $scope.modalContent = "Thêm địa chỉ thành công";
                        } else {
                            $scope.modalContent = "Cập nhật địa chỉ thành công";
                        }

                        $('#message').modal('show');
                        // Gọi hàm để ẩn modal sau một khoảng thời gian (ví dụ: sau 2 giây)
                        $timeout(function () {
                            $('#message').modal('hide');
                        }, 1000);
                        $scope.resetAddress();

                    })
                    .catch(function (error) {
                        // Xử lý lỗi nếu có
                        console.error("Lỗi khi lưu địa chỉ:", error);
                    });
            }

        };
        //hàm edit địa chỉ
        $scope.editAddress = function (id) {
            $scope.isAddingAddress = false;
            $scope.isEditingAddress = true;

            var url = `${host}/profile_address/${id}`;
            $http.get(url).then(function (resp) {
                var address = resp.data;
                if (address) {
                    $scope.setProvinceByAddress(address);
                } else {
                    console.log("Không tìm thấy địa chỉ với ID này.");
                }
            })
                .catch(function (error) {
                    console.log("Lỗi khi lấy thông tin địa chỉ:", error);
                });
        };

        $scope.setProvinceByAddress = function (address) {
            var addressParts = address.address.split(',');

            if (addressParts.length >= 4) {
                // Lấy các phần tử tương ứng
                var selectedProvinceName = addressParts[3].trim();
                var selectedDistrictName = addressParts[2].trim();
                var selectedWardName = addressParts[1].trim();
                var detailedAddress = addressParts[0].trim();

                console.log("Đâu RÒI '", selectedProvinceName, "'");
                console.log("Đâu RÒI '", selectedDistrictName, "'");
                console.log("Đâu RÒI '", selectedWardName, "'");
                console.log("Đâu RÒI '", detailedAddress, "'");


                // Gán giá trị cho fullname và phone từ đối tượng địa chỉ
                $scope.address = {
                    id: address.id,
                    fullname: address.fullname,
                    phone: address.phone,
                    adr: detailedAddress
                };
                var province = $scope.listProvince.find(function (province) {
                    return province.name === selectedProvinceName;
                });

                console.log(province.code);
                var district = province.districts.find(function (district) {
                    return district.name === selectedDistrictName;
                });
                console.log(district.code);
                var ward = district.wards.find(function (ward) {
                    return ward.name === selectedWardName;
                });
                console.log(ward.code);
                // Gán giá trị cho mã code của tỉnh, quận và xã
                $scope.selectedProvinceCode = province.code;
                $scope.selectedDistrictCode = district.code;
                $scope.selectedWardCode = ward.code;

                $scope.getListDistrict();
                $scope.getListWard();
                // Mở modal chỉnh sửa địa chỉ
                $('#createAddressModal').modal('show');
            }
        }

        $scope.resetAddress = function () {
            // Đặt các trường nhập liệu về giá trị mặc định hoặc rỗng
            $scope.address = {};
            $scope.errors = {};
            // Đặt các giá trị mã code và danh sách về giá trị mặc định
            $scope.selectedProvinceCode = "";
            $scope.selectedDistrictCode = "";
            $scope.selectedWardCode = "";
            $scope.listDistrict = [];
            $scope.listWard = "";
            $scope.isAddingAddress = true;
            $scope.isEditingAddress = false;
        };
        //Model thêm địa chỉ
        $scope.addModel = function () {
            $scope.isAddingAddress = true;
            $scope.isEditingAddress = false;
            // Các công việc khác khi nhấp vào "Thêm địa chỉ"
            $scope.resetAddress();
        };
        /// Hàm hiển thị modal xác nhận
        $scope.showConfirmAddress = function (id) {
            $scope.address.id = id;
            $('#addressDelete').modal('show'); // Hiển thị modal xác nhận
        };

        $scope.deleteAddress = function () {
            var url = `${host}/profile_address/${$scope.address.id}`;
            $('#createAddressModal').modal('hide'); // Đóng modal xác nhận trước (nếu đã mở)
            $http.delete(url)
                .then(function (response) {
                    console.log('Xóa thành công');
                    init();

                    $scope.modalContent = "Xóa địa chỉ thành công";
                    $('#addressDelete').modal('hide');
                    $('#message').modal('show');
                    // Gọi hàm để ẩn modal sau một khoảng thời gian (ví dụ: sau 2 giây)
                    $timeout(function () {
                        $('#message').modal('hide');
                    }, 1500);
                    $scope.resetAddress();
                })
                .catch(function (error) {
                    console.log('Xóa thất bại');
                    // Xử lý lỗi nếu cần
                });

        };
        //BẮt lỗi
        $scope.checkErrors = function () {
            $scope.errors = {};

            // Kiểm tra các điều kiện cho trường fullname
            if ($scope.address.fullname == null) {
                $scope.errors.fullname = 'Vui lòng nhập họ và tên';
            } else if ($scope.address.fullname.length < 10) {
                $scope.errors.fullname = 'Họ và tên phải có ít nhất 10 ký tự';
            } 

            var reg = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
            // Kiểm tra các điều kiện cho trường phone
            if (!$scope.address.phone) {
                $scope.errors.phone = 'Vui lòng nhập số điện thoại';
            } else if (!reg.test($scope.address.phone)) {
                $scope.errors.phone = 'Số điện thoại không đúng định dạng ';
            }
            
            // Kiểm tra các điều kiện cho trường province
            if (!$scope.selectedProvinceCode) {
                $scope.errors.province = 'Vui lòng chọn tỉnh/thành phố';
            }

            // Kiểm tra các điều kiện cho trường district
            if (!$scope.selectedDistrictCode) {
                $scope.errors.district = 'Vui lòng chọn quận/huyện';
            }

            // Kiểm tra các điều kiện cho trường ward
            if (!$scope.selectedWardCode) {
                $scope.errors.ward = 'Vui lòng chọn xã/phường';
            }

            // Kiểm tra các điều kiện cho trường adr (địa chỉ cụ thể)
            if (!$scope.address.adr) {
                $scope.errors.adr = 'Vui lòng nhập địa chỉ cụ thể';
            }

            // Kiểm tra nếu có bất kỳ lỗi nào xuất hiện
            var hasErrors = Object.keys($scope.errors).length > 0;
            return !hasErrors;
        };


    }

    function init() {
        $scope.loadData($scope.username);
        $scope.getProvince();
    }

    init();
    initJavascript();
}

// Mã JavaScript cho Javasricpt
function initJavascript() {

    const statusButtons = document.querySelectorAll('.order-status-button');

    statusButtons.forEach(button => {
        button.addEventListener('click', () => {
            statusButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    const changePasswordCheckbox = document.getElementById("change_password_checkbox");
    const passwordFields = document.getElementById("password_fields");

    changePasswordCheckbox.addEventListener("change", function () {
        if (this.checked) {
            passwordFields.style.display = "block";
        } else {
            passwordFields.style.display = "none";
        }
    });
}