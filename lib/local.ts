// import * as fs from 'fs';
// import * as https from 'https';
// import config from '../config';
import app from './app';
import path from 'path';





app.listen(process.env.PORT, () => {
    
    console.log('Express server listening on port ' + process.env.PORT);
});

// for http2

// const httpsOptions = {
//     key: fs.readFileSync('../config/cert-key/key.pem'),
//     cert: fs.readFileSync('../config/cert-key/cert.pem')
// }

// https.createServer(httpsOptions, app).listen(PORT, () => {
//     console.log('Express server listening on port ' + PORT);
// })
