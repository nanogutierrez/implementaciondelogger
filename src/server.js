import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import productsRoutes from './routes/products.routes.js'
import viewsRoutes from './routes/views.routes.js'
import userRoutes from './routes/user.routes.js'
import sessionRoutes from './routes/sessions.routes.js'
import mongoose from 'mongoose';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import nodemailer from "nodemailer";
import { addLogger } from './validators/logger.js';


const app = express();

// MongoDB local
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://nanogutierrez16:Cochoco16@cluster0.fsqmw1t.mongodb.net/?retryWrites=true&w=majority'), (error) => {
  if(error) {
    console.log('Error al conectar a Mongodb', error);
  } else {
    console.log('Conectado a Mongodb');
  }
}

// Handlebars
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'main.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
initializePassport()
app.use(passport.initialize())

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/', viewsRoutes);


const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'gutierrez.nano@gmail.com',
    pass: 'ycblksxwinnpgotx'
  }
})

app.get('/mail', async (req, res) => {
  const result = await transport.sendMail({
    from: 'coderhouse@gmail.com',
    to: 'gutierrez.nano@gmail.com',
    subject: "Prueba de envío de mail",
    html: `
      <div>
        <h1>Prueba de envío de mail</h1>
      </div>
    `,
    attachments: []
  })

  res.json({ result })
})

app.use(addLogger);


app.get('/', (req, res) => {
  // req.logger.warn('Hola mundo, esto es un warning');
  res.send('Hola bienvenido a Tentatortas');
});

app.get('/warning', (req, res) => {
  req.logger.warn('Hola usuario, esto es un warning');
  req.logger.info('Hola usuario, esto es un info');
  res.send('Hola usuario warning');
});


app.listen(3000, () => { console.log('Servidor escuchando en el puerto 3000') })