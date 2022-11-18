
const  express = require('express')
const app = express();

import auth from "./router/auth";
import api from "./product/cetegary"


app.set('port', process.env.PORT || 2020) 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
    res.send('Hello World!')
})

app.use('/auth', auth);
app.use('/api', api);




app.listen(app.get('port'), () => {
    console.info(`Server listen on port ${app.get('port')}`);
})