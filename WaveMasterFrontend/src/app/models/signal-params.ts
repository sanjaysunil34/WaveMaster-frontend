/**
 * Represents the params for the signal to be generated.
 */
export class SignalParams{
    constructor(
        public frequency: number, 
        public peakToPeak: number, 
        public signalType: string = "sine"
    ) {}
}