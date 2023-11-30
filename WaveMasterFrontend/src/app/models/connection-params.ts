/**
 * represents parameters required to start a serial port connection
 */
export class ConnectionParams{
    constructor(
        public portName: string, // port to which connection is to be made
        public stopBit: number, // Number of stop bits for the connection
        public baudRate: number, // Rate of transmission in bits per second
        public dataBit: number, // Number of data bits sent in each character
        public parity: string // parity for communication
    ) {}
}