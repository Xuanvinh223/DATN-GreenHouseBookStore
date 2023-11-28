app.controller("checkoutController", function ($scope, $http, checkoutAPI, $timeout) {

    $scope.checkoutDataPayment = {};
    // SCOPE DECLARE - START
    $scope.infoReceiver = {};

    $scope.products = [];

    $scope.totalAmount = 0;
    $scope.totalPaymentAmount = 0;
    $scope.shippingFee = 0;
    // SCOPE DECLARE - END
    //=====================================================================================================================
    //=====================================================================================================================

    function getData() {
        var api = `${checkoutAPI}/getData`;
        $http.get(api)
            .then(function (response) {
                if (response.data.status == "success") {
                    console.log("Dữ liệu CHECKOUT từ API:", response.data);
                    var checkoutData = response.data.checkoutData;
                    $scope.checkoutDataPayment = checkoutData;
                    $scope.infoReceiver = {
                        to_name: checkoutData.to_name,
                        to_phone: checkoutData.to_phone,
                        to_address: checkoutData.to_address,
                        to_district_id: checkoutData.to_district_id,
                        to_ward_code: checkoutData.to_ward_code,
                    };
                    $scope.products = checkoutData.carts;
                    $scope.totalAmount = checkoutData.total_amount;
                    $scope.totalPaymentAmount = checkoutData.payment_total;
                    $scope.shippingFee = checkoutData.shipping_fee;
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

    //================================================================
    $scope.checkout = function () {
        var api = `${checkoutAPI}/create-payment`;
        $scope.checkoutDataPayment.payment_method = $scope.paymentMethod;
        var data = $scope.checkoutDataPayment;
        console.log("Dữ liệu gửi về API để thanh toán: ", data);
        $http.post(api, data)
            .then(function (response) {
                if (response.data.status == "success") {
                    var invoice = response.data.invoices;
                    var order = response.data.order;
                    var payment_method = response.data.payment_method;
                    if (payment_method == "cod") {
                        checkoutCompleted(invoice, order);
                    } else {
                        window.location.href = response.data.url;
                    }
                } else if (response.data.status == "error-voucher") {
                    Swal.fire({
                        icon: "warring",
                        title: "Mã giảm đã hết lượt sử dụng",
                        confirmButtonText: "OK"
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.location.href = '/cart';
                        }
                    })
                }
                console.log(response);
            })
            .catch(function (error) {
                console.error('Error calling API:', error);
            });
    }

    // ----------------------------------------------------------------

    function checkoutCompleted(invoice, order) {
        var api = `${checkoutAPI}/setCheckoutCompleteData`

        var data = {
            invoices: invoice,
            orders: order
        }
        $http.post(api, data)
            .then(function (response) {
                console.log(response.data);
                if (response.data.status == "success") {
                    var url = response.data;
                    window.location.href = url;
                }
            })
            .catch(function (error) {
                console.error('Error calling API:', error);
            });
    }

    function init() {
        getData();
    }

    init();
});