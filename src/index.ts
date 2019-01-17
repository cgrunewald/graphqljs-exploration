/*
 * Copyright (c) 2019 Calvin Grunewald 
 */
import * as express from 'express';
import * as ExpressGraphql from 'express-graphql';

import {printSchema} from 'graphql/utilities';
import schema from './graphql/Schema';

const app = express();

app.use('/graphql', ExpressGraphql({
    schema: schema,
    graphiql: true,
}));

console.log(printSchema(schema));

app.listen(3000, () => {
    console.log('created server');
});