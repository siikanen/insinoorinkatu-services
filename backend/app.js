const express = require('express');
const path = require('path');
const logger = require('morgan');
const {connectDatabase,disconnectDatabase} = require('./database/interface/databaseInterface')
const apiRouterv1 = require('./routes/v1/api');
const { disconnect } = require('process');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouterv1)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//NOTE: testing
const testDatabase = async()=>{
await connectDatabase()

}
testDatabase()
module.exports = app;
