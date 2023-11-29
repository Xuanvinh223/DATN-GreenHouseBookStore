app.controller("checkoutCompleteController", function ($scope, $http, checkoutAPI) {

    $scope.invoice = [];
    $scope.order = [];
    $scope.invoiceDetails = [];
    $scope.orderDetails = [];
    $scope.invoiceMV = [];

    function getData() {
        var api = `${checkoutAPI}/getCheckoutCompleteData`;
        $http.get(api)
            .then(function (response) {
                if (response.data.status == "success") {
                    console.log("Dữ liệu CHECKOUT COMPLETE từ API:", response.data);
                    $scope.invoice = response.data.invoice;
                    $scope.order = response.data.order;
                    $scope.invoiceDetails = response.data.invoiceDetails;
                    $scope.orderDetails = response.data.orderDetails;
                    $scope.invoiceMV = response.data.invoiceMV;
                } else {
                    console.log(response.data.message);
                }
            })
            .catch(function (error) {
                console.error('Error calling API:', error);
            });
    }
    //----------------------------------------------------------------
    $scope.VNnum2words = function (num) {
        return VNnum2words(parseInt(num));
    };

    function init() {
        getData();
    }

    init();
});