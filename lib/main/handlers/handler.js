class Handler {
    postValue = "";
    constructor() {
        if (this.constructor == Handler) {
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

module.exports = {
    Handler
}
