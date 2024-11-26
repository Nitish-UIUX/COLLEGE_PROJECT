import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import { promisify } from 'util';
// Load private and public keys
const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const blacklist = new Set();

export default blacklist;

//get message - start ----------------------------------------------------------------------------------------------------------

export const getMessage = (req, res) => {
 
    res.send('Hello from the server');
}


//get message - end ------------------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Register route - start-------------------------------------------------------------------------------------------------------





















export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if name, email, password, and role are provided
 // console.log('registering user:', name, email, password, role);

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required' });
  }

  try {
    // Promisify the query method
    const query = promisify(req.db.query).bind(req.db);

    // Check if the user already exists
    const userCheckQuery = 'SELECT * FROM users WHERE email = ?';
    const existingUsers = await query(userCheckQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    await query(insertQuery, [name, email, hashedPassword, role]);

    res.status(201).json({ message: 'User registered successfully, Please login.' });
  } catch (error) {
    console.error('Error executing query: ' + error);
    res.status(500).json({ error: 'Internal server error' });
  }
};






















// Register route - end---------------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Login route - start----------------------------------------------------------------------------------------------------------

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Example SQL query to fetch user data based on email
  const query = 'SELECT * FROM users WHERE email = ?';
  const values = [email];

  // Execute the query
  req.db.query(query, values, async (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if user with the given email exists
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password from the database
    const user = { ...results[0] };
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate an access token
    const accessToken = jwt.sign({ user }, privateKey, { algorithm: 'RS256', expiresIn: '8766h' });

    // Send the access token to the client
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    //also send the token in the response body

    res.json({ message: 'Login successful' , accessToken ,  userData: user });
  });
};
// Login route - end------------------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Logout route - start----------------------------------------------------------------------------------------------------------
export const logout = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(400).json({ message: 'Authorization header missing' });
  }

  const accessToken = req.headers.authorization.split(' ')[1];
  const token = accessToken.replace(/^"(.*)"$/, '$1');

  console.log('Logging out user with token:', token);

  // Add the token to the blacklist
  blacklist.add(token);
  console.log('Blacklist:', blacklist);

  // Clear the accessToken cookie
  res.clearCookie('accessToken');
  res.json({ message: 'Logout successful' });
};



// Logout route - end----------------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Profile route - start-------------------------------------------------------------------------------------------------------


//____________________total 4 queries____________________}}}}}}}}}}}}}
export const profile = async (req, res) => {
  try {
    const { user } = req.authData;
    const values = [user.id];
    
    const assignedQuery = 'SELECT * FROM appointments WHERE user_id = ?';
    const userHospitalQuery = 'SELECT * FROM user_hospital_treatment_booking WHERE user_id = ?';
    // const doctorQuery = 'SELECT * FROM doctors WHERE user_id = ?';
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    const cartQuery = 'SELECT * FROM product_orders WHERE CustomerID = ?';
    //{{{{{{{_____1_______You can add more queries here_____________1_______________}}}}}}}
    
    // Promisify the query method
    const dbQuery = (query, values) => {
      return new Promise((resolve, reject) => {
        req.db.query(query, values, (error, results) => {
          if (error) {
            return reject(error);
            }
            resolve(results);
            });
            });
            };
            
            // Execute both queries concurrently
            //{{{{{{{_____2_______You can add more queries here_______________2_____________}}}}}}}
            const [assignedResults, userHospitalResults , userResults , cartResults] = await Promise.all([
              dbQuery(assignedQuery, values),
              dbQuery(userHospitalQuery, values),
              // dbQuery(doctorQuery, values),
              dbQuery(userQuery, values),
              dbQuery(cartQuery, values),
              //{{{{{{{______3______You can add more queries here______________3______________}}}}}}}
              ]);
              
              // Send the user data along with data from both tables
    res.json({
      user_details: userResults[0],
      doctor_appointments: assignedResults,
      hospital_treatment_bookings: userHospitalResults,
      // doctor: doctorResults,
      ordered_products: cartResults,

      //{{{{{{{____4________You can add more queries here_______________4_____________}}}}}}}
      });
      } catch (error) {
    console.error('Error executing queries: ', error.stack);
    res.status(500).json({ error: 'Internal server error' });
    }
    };
// Profile route - end---------------------------------------------------------------------------------------------------------
  
export const getUserById = async (req, res) => {

  return res.json({ user: req.authData.user.name , email: req.authData.user.email , profile_image: req.authData.user.profile_image });

  // const { user } = req.authData;
  //   const values = [user.id];
  // const query = 'SELECT * FROM users WHERE id = ?';

  // req.db.query(query, values, (error, results) => {
  //   if (error) {
  //     console.error('Error executing query:', error);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }

  //   if (results.length === 0) {
  //     return res.status(404).json({ error: 'User not found' });
  //   }

  // });
};

// Profile edit route - start---------------------------------------------------------------------------------------------------


    


    
























    
    
// export const profileEdit = async (req, res) => {
//   const { user } = req.authData;
//   const {
//     name, email, password, role, Assigned, gender, phone, address, city, state,
//     country, postal_code, age, dob, height, weight, hospital, doctor, cart
//   } = req.body;

//   // Initialize arrays to hold queries and values for each table
//   const queries = [];
//   const values = [];

//   // Helper function to push query parts and values
//   const addQueryPart = (table, fields, userIdField = 'user_id') => {
//     const parts = [];
//     const fieldValues = [];

//     Object.keys(fields).forEach(key => {
//       if (fields[key] !== undefined) {
//         parts.push(`${key} = ?`);
//         fieldValues.push(fields[key]);
//       }
//     });

//     if (parts.length > 0) {
//       const query = `UPDATE ${table} SET ${parts.join(', ')} WHERE ${userIdField} = ?`;
//       queries.push(query);
//       values.push([...fieldValues, user.id]);
//     }
//   };

//   // Add queries and values for each table
//   addQueryPart('users', { name, email, password, role, gender, phone, address, city, state, country, postal_code, age, dob, height, weight }, 'id');
//   addQueryPart('assigned', { Assigned });
//   addQueryPart('user_hospitals', { hospital });
//   addQueryPart('doctors', { doctor });
//   addQueryPart('cart', { cart });

//   // Check if there are no fields to update
//   if (queries.length === 0) {
//     return res.status(400).json({ error: 'No fields to update' });
//   }

//   try {
//     // Execute each query with its corresponding values
//     const dbQuery = (query, values) => {
//       return new Promise((resolve, reject) => {
//         req.db.query(query, values, (error, results) => {
//           if (error) {
//             return reject(error);
//           }
//           resolve(results);
//         });
//       });
//     };

//     await Promise.all(queries.map((query, index) => dbQuery(query, values[index])));

//     res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Error executing queries: ', error.stack);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

    
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Profile edit route - start---------------------------------------------------------------------------------------------------




























// controllers/userController.js
export const profileEdit = async (req, res) => {
  const { user } = req.authData;
  const id = user.id; 

  const {
    name, email, gender, weight, age, height,
    address_line1, address_line2, city, state, postal_code, country, phone
  } = req.body;

  const query = `
    UPDATE users
    SET name = ?,
        email = ?,
        gender = ?,
        weight = ?,
        age = ?,
        height = ?,
        address_line1 = ?,
        address_line2 = ?,
        city = ?,
        state = ?,
        postal_code = ?,
        country = ?,
        phone = ?
    WHERE id = ?
  `;

  const values = [
    name, email, gender, weight, age, height,
    address_line1, address_line2, city, state, postal_code, country, phone, id
  ];

  req.db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json({ message: "Profile updated successfully" });
  });
};













































    

 





































































































































































// export const profileEdit = async (req, res) => {
//   const saltRounds = 10;
//   const { user } = req.authData;
//   const { name, email, password, role, Assigned, gender, phone, address, city, state, country, postal_code, age, dob, height, weight } = req.body;

//   // Initialize an array to hold query parts and values
//   const queryParts = [];
//   const values = [];

//   if (name) {
//     queryParts.push('name = ?');
//     values.push(name);
//   }
//   if (email) {
//     queryParts.push('email = ?');
//     values.push(email);
//   }
//   if (password) {
//     bcrypt.hash(password, saltRounds, (err, hash) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
  
//       // Use the hashed password instead of the plaintext password
//       queryParts.push('password = ?');
//       values.push(hash);
  
//       // Continue with your database query execution...
//     });
//   }
//   if (role) {
//     queryParts.push('role = ?');
//     values.push(role);
//   }
//   if (Assigned) {
//     queryParts.push('Assigned = ?');
//     values.push(Assigned);
//   }
//   if (gender) {
//     queryParts.push('gender = ?');
//     values.push(gender);
//   }
//   if (phone) {
//     queryParts.push('phone = ?');
//     values.push(phone);
//   }
//   if (address) {
//     queryParts.push('address = ?');
//     values.push(address);
//   }
//   if (city) {
//     queryParts.push('city = ?');
//     values.push(city);
//   }
//   if (state) {
//     queryParts.push('state = ?');
//     values.push(state);
//   }
//   if (country) {
//     queryParts.push('country = ?');
//     values.push(country);
//   }
//   if (postal_code) {
//     queryParts.push('postal_code = ?');
//     values.push(postal_code);
//   }
//   if (age) {
//     queryParts.push('age = ?');
//     values.push(age);
//   }
//   if (dob) {
//     queryParts.push('dob = ?');
//     values.push(dob);
//   }
//   if (height) {
//     queryParts.push('height = ?');
//     values.push(height);
//   }
//   if (weight) {
//     queryParts.push('weight = ?');
//     values.push(weight);
//   }

//   if (queryParts.length === 0) {
//     return res.status(400).json({ error: 'No fields to update' });
//   }

//   const query = `UPDATE users SET ${queryParts.join(', ')} WHERE id = ?`;
//   values.push(user.id);

//   try {
//     const [results] = await req.db.execute(query, values);

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Error executing query:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// Profile edit route - end-----------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Profile delete route - start-------------------------------------------------------------------------------------------------

export const profileDelete = async (req, res) => {
  const { user } = req.authData;
  const values = [user.id];
  const query = 'DELETE FROM users WHERE id = ?';

  req.db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ message: 'Profile deleted successfully' });
  });
};

// Profile delete route - end---------------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Admin profile route - start--------------------------------------------------------------------------------------------------

export const adminProfile = async (req, res) => {
//get all users
  const query = 'SELECT * FROM users';
  req.db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ users: results });
  });
};
// Admin profile route - end----------------------------------------------------------------------------------------------------  
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Admin profile edit route - start--------------------------------------------------------------------------------------------
export const adminProfileEdit = async (req, res) => {
  const { user_id , name, email, password, role, Assigned, gender, phone, address, city, state, country, postal_code, age, dob, height, weight } = req.body;

  // Initialize an array to hold query parts and values
  const queryParts = [];
  const values = [];

  if (name) {
    queryParts.push('name = ?');
    values.push(name);
  }
  if (email) {
    queryParts.push('email = ?');
    values.push(email);
  }
  if (password) {
    // Ideally, you should hash the password before storing it
    queryParts.push('password = ?');
    values.push(password);
  }
  if (role) {
    queryParts.push('role = ?');
    values.push(role);
  }
  if (Assigned) {
    queryParts.push('Assigned = ?');
    values.push(Assigned);
  }
  if (gender) {
    queryParts.push('gender = ?');
    values.push(gender);
  }
  if (phone) {
    queryParts.push('phone = ?');
    values.push(phone);
  }
  if (address) {
    queryParts.push('address = ?');
    values.push(address);
  }
  if (city) {
    queryParts.push('city = ?');
    values.push(city);
  }
  if (state) {
    queryParts.push('state = ?');
    values.push(state);
  }
  if (country) {
    queryParts.push('country = ?');
    values.push(country);
  }
  if (postal_code) {
    queryParts.push('postal_code = ?');
    values.push(postal_code);
  }
  if (age) {
    queryParts.push('age = ?');
    values.push(age);
  }
  if (dob) {
    queryParts.push('dob = ?');
    values.push(dob);
  }
  if (height) {
    queryParts.push('height = ?');
    values.push(height);
  }
  if (weight) {
    queryParts.push('weight = ?');
    values.push(weight);
  }

  if (queryParts.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const query = `UPDATE users SET ${queryParts.join(', ')} WHERE id = ?`;
  values.push(user_id);

  try {
    const [results] = await req.db.execute(query, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin profile edit route - end----------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Admin profile delete route - start------------------------------------------------------------------------------------------

export const adminProfileDelete = async (req, res) => {
  const { user_id } = req.body;
  const values = [user_id];
  const query = 'DELETE FROM users WHERE id = ?';

  req.db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ message: 'Profile deleted successfully' });
  });
}

// Admin profile delete route - end--------------------------------------------------------------------------------------------
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  