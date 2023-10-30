class handler {
    postValue = "";
    constructor() {
        if (this.constructor == ContentHandler) {
            throw new Error("default ContentHandlers can't be instantiated.");
        }
    }

    accumulateChunkData(chunk){
        if(chunk != null) {
            this.postValue+=chunk;
        }
    }
   
    async handle(req) {
       
    }

}
