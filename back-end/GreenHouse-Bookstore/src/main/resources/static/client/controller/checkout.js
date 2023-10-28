app.controller("checkOutController", function ($scope, $http, checkOutAPI, $timeout) {
    const host = checkOutAPI;


    // SCOPE DECLARE - START

    $scope.listProvince = []; // Danh sách các tỉnh/thành phố
    $scope.listDistrict = []; // Danh sách các quận/huyện tương ứng với tỉnh/thành phố được chọn
    $scope.listWard = []; // Danh sách các phường/xã tương ứng với quận/huyện được chọn

    // SCOPE DECLARE - END
    //=====================================================================================================================
    //=====================================================================================================================
    //  SECONDARY FUNCTION - START

    $scope.getProvince = function () {
        var url = "https://provinces.open-api.vn/api/?depth=3";

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) { }
            $scope.listProvince = JSON.parse(xhr.responseText);
            console.log($scope.listProvince);
        }
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
        console.log(selectedDistrict);
    };


    // SECONDARY FUNCTION - END



    function init() {
        $scope.getProvince();
    }

    init();
});