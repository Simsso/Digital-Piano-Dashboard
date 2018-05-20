class SocketManager {
    constructor(http) {
        this.sockets = [];
        
        this.io = require('socket.io')(http);

        this._registerEvents();
    }

    _registerEvents() {
        this.io.on('connection', (socket) => {
            this.addSocket(socket);
            socket.on('disconnect', this.removeSocket.bind(this));
        });
    }

    addSocket(socket) {
        this.sockets.push(socket);
    }

    removeSocket(socket) {
        const position = this.sockets.indexOf(socket);
        if (position !== -1) {
            this.sockets.splice(position, 1);
        }
    }

    broadcast(event, data) {
        this.io.emit(event, data);
    }

    getCount() {
        return this.sockets.length;
    }
}

module.exports = SocketManager;