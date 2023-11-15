export class SignalData{
    SignalType: string = "sine"
    Frequency: number
    PeakToPeak: number

    constructor(frequency:number,peakToPeak:number){
        this.Frequency = frequency
        this.PeakToPeak = peakToPeak
    }
}