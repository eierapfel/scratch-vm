const ROSLIB = require('roslib');

class RosUtil extends ROSLIB.Ros {
    constructor (runtime, extensionId, options) {
        super(options);

        this.runtime = runtime;
        this.extensionId = extensionId;
        this.everConnected = false;

        this.on('connection', () => {
            this.everConnected = true;
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
        });

        this.on('close', () => {
            if (this.everConnected) {
                this.runtime.emit(this.runtime.constructor.PERIPHERAL_DISCONNECT_ERROR, {
                    message: `Scratch lost connection to`,
                    extensionId: this.extensionId
                });
            }
        });

        this.on('error', () => {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_REQUEST_ERROR, {
                message: `Scratch lost connection to`,
                extensionId: this.extensionId
            });
        });
    }
}

module.exports = RosUtil;
