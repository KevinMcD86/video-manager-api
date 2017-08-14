export class Globals {
    debugWait : boolean;
    
    constructor() {
        this.debugWait = true;
    }

    Sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}