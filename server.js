// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios'); // Nếu cần dùng cho các tính năng bổ sung trong tương lai

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép Express parse JSON body
app.use(express.json());

// Tạo server HTTP và tích hợp Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Nếu FE chạy trên domain khác, hãy cấu hình chính xác
        methods: ["GET", "POST"]
    }
});

// Khi có client kết nối qua Socket.IO
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Bạn có thể thiết lập các sự kiện tùy chỉnh tại đây (ví dụ subscribe, room, v.v.)

    // Khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Tạo REST endpoint để backend thông báo cập nhật dữ liệu
app.post('/notify', (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        return res.status(400).json({ error: "Chưa truyền đủ key và value" });
    }
    // Phát sự kiện 'dataUpdate' tới tất cả các client đã kết nối.
    // Nếu muốn, bạn có thể sử dụng rooms để chỉ gửi đến những client đã subscribe key này.
    io.emit('dataUpdate', { key, value });
    console.log(`Notification sent for key: ${key}, value: ${value}`);
    res.status(200).json({ message: 'Notification sent' });
});

// Khởi chạy server
server.listen(PORT, () => {
    console.log(`Socket server is running on port ${PORT}`);
});
