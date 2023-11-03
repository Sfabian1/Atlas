const http = require("http"); 
const Response = require("./util/response.js");

const ErrorHandler = require("./util/error-handler.js");
const SQLConnection = require("./util/sqlconnector.js");
const ServerUtil = require("./util/server-utils.js");
const Config = require("../config/config.js");

async function processRequest(req) {
    return new Promise((resolve) => {
        try {
            
            ServerUtil.validateHeaderType(req);
            var handler = ServerUtil.selectHandler(req.url);
            resolve(handler.handle(req))
        } catch(err) {
            console.log(`server found error ${err}`);
            resolve(ErrorHandler.handleError(err));
        }
    });
   
}

function applicationServer(req, res) {
    console.log(`Recieved request `);
    processRequest(req).then(resp => {
        res.setHeader('content-type', resp.getContentType());
        res.writeHead(resp.getCode());
        res.end(resp.getMessage());
    });
    console.log(`processed request `)
}
    
function init() {
    const port = (process.env.PORT || Config.config.app.port);
    const host = Config.config.app.host;
    console.log(`starting server on port ${port}`);
    const webServer = http.createServer(applicationServer);
    webServer.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
} 

init();

