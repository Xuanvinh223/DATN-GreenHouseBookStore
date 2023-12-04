// Tạo một service hoặc factory (ví dụ, WebSocketService)
app.factory('WebSocketService', function () {
    var stompClient = null;

    function connect(callback) {
        var socket = new SockJS('http://localhost:8081/websocket/gs-guide-websocket');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/products', function (message) {
                // Nhận biết thông điệp và gọi callback
                if (message.body === 'update') {
                    callback();
                }
            });
        });
    }

    return {
        connect: connect
    };
});
