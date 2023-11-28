export class ConnectionParams{
    portName: string
    stopBit: number
    baudRate: number
    dataBit: number
    parity: string    

    constructor(port:string, sb:number, br:number, db:number, par:string){
        this.portName = port;
        this.stopBit = sb;
        this.baudRate = br;
        this.dataBit = db;
        this.parity = par;
    }
}