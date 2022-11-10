const cors = require("cors");
const express = require('express');
const { Server } = require("socket.io");

const http = require('http');
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
    socket.emit("setID", socket.id);

    console.log(socket.id)

    // socket.on("disconnect", () => {
    //     socket.broadcast.emit("callEnded")
    // });

    socket.on("callUser", ({ calling, from, signalData }) => {
        // console.log('Share')
        io.to(calling).emit("callUser", { signalData, from });
    });

    socket.on("answerCall", ({ calling, signalData }) => {
        io.to(calling).emit("answerCall", { signalData })
    });

    socket.on("sentOffer", ({ calling, from, signalData }) => {
        io.to(calling).emit("sentOffer", { signalData, from });
    });
    socket.on("acceptedOffer", ({ to, signalData }) => {
        io.to(to).emit("acceptedOffer", { signalData });
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));