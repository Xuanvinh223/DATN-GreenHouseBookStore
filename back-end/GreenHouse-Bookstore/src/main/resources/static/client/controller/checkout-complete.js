app.controller("checkoutCompleteController", function ($scope, $http, checkoutAPI) {

    $scope.invoice = [];
    $scope.order = [];
    $scope.invoiceDetails = [];
    $scope.orderDetails = [];
    $scope.invoiceMV = [];
    //================================================
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    //================================================
    function getData() {
        var currentURL = window.location.href;
        var startIndex = currentURL.indexOf("payment-callback?");
        if (startIndex === -1) {
            var api = `${checkoutAPI}/getCheckoutCompleteData`;
            $http.get(api)
                .then(function (response) {
                    console.log("Dữ liệu CHECKOUT COMPLETE từ API:", response.data);
                    $scope.invoice = response.data.invoice;
                    $scope.order = response.data.order;
                    $scope.invoiceDetails = response.data.invoiceDetails;
                    $scope.orderDetails = response.data.orderDetails;
                    $scope.invoiceMV = response.data.invoiceMV;
                    if (response.data.status == "success") {
                        $scope.payment_status = true;
                    } else {
                        $scope.payment_status = false;
                    }
                })
                .catch(function (error) {
                    console.error('Error calling API:', error);
                });
        } else {
            if (currentURL.indexOf("vnp_TxnRef") > -1) {
                var vnPayData = {
                    vnp_Amount: getParameterByName('vnp_Amount'),
                    vnp_BankCode: getParameterByName('vnp_BankCode'),
                    vnp_BankTranNo: getParameterByName('vnp_BankTranNo'),
                    vnp_CardType: getParameterByName('vnp_CardType'),
                    vnp_OrderInfo: getParameterByName('vnp_OrderInfo'),
                    vnp_PayDate: getParameterByName('vnp_PayDate'),
                    vnp_ResponseCode: getParameterByName('vnp_ResponseCode'),
                    vnp_TmnCode: getParameterByName('vnp_TmnCode'),
                    vnp_TransactionNo: getParameterByName('vnp_TransactionNo'),
                    vnp_TransactionStatus: getParameterByName('vnp_TransactionStatus'),
                    vnp_TxnRef: getParameterByName('vnp_TxnRef'),
                    vnp_SecureHash: getParameterByName('vnp_SecureHash')
                };

                var url = `${checkoutAPI}/vnPay-payment-callback`;
                $http({
                    method: 'POST',
                    url: url,
                    data: vnPayData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    window.location.href = "/checkout-complete";
                }).catch(function (error) {
                    console.error("Lỗi khi gọi API:", error);
                });
            } else {
                var payOSData = {
                    code: getParameterByName('code'),
                    id: getParameterByName('id'),
                    cancel: getParameterByName('cancel'),
                    status: getParameterByName('status'),
                    orderCode: getParameterByName('orderCode')
                };

                var url = `${checkoutAPI}/payOS-payment-callback`;
                $http({
                    method: 'POST',
                    url: url,
                    data: payOSData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    window.location.href = "/checkout-complete";
                }).catch(function (error) {
                    console.error("Lỗi khi gọi API:", error);
                });
            }
        }
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