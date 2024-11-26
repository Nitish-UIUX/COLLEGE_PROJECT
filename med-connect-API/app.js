import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import routes from './routes.js';

const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'medconnect'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

// Pass the database connection to routes
app.use((req, res, next) => {
  req.db = connection;
  next();
});

// Use the routes defined in routes.js
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
