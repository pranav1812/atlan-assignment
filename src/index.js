const express= require('express');
const cors= require('cors');
const { urlencoded } = require('express');
require('dotenv').config({ path: '.env' });
console.log(process.env.SIGNING_KEY);
const app= express();

app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));

app.get('/', (_, res)=> {
    res.send("Atlan Assignment server up and running");
})

app.use('/users', require('./routes/users.route'));
app.use('/forms', require('./routes/forms.route'));
app.use('/plugins', require('./routes/plugin.route'));

const PORT= process.env.PORT || 5001;

app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})