export const getAllHospitals = async (req, res) => {
  req.db.query("SELECT * FROM hospitals", (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
};










export const getHospitalsById = async (req, res) => {
  const hospital_id = req.params.hospital_id;
  
  // Query to get hospital details
  req.db.query(
    `SELECT * FROM hospitals WHERE hospital_id = ?`,
    [hospital_id],
    (error, hospitalResults) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (hospitalResults.length === 0) {
        res.status(404).json({ error: "Hospital not found" });
        return;
      }

      const hospital = hospitalResults[0];
      const hospital_treatment_ids = hospital.hospital_treatment_id;
      const treatment_ids = hospital_treatment_ids.split(',').map(id => parseInt(id.trim()));
      const hospital_doctors_ids = hospital.hospital_doctors_id;
      const doctor_ids = hospital_doctors_ids.split(',').map(id => parseInt(id.trim()));

      // Query to get treatments
      req.db.query(
        `SELECT * FROM treatments WHERE treatment_id IN (?)`,
        [treatment_ids],
        (error, treatmentResults) => {
          if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
          }

          // Query to get doctors
          req.db.query(
            `SELECT * FROM doctors WHERE doctor_id IN (?)`,
            [doctor_ids],
            (error, doctorResults) => {
              if (error) {
                console.error("Error executing query: " + error.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
              }

              const response = {
                hospital: hospital,
                treatments: treatmentResults,
                doctors: doctorResults
              };

              res.json(response);
            }
          );
        }
      );
    }
  );
};





// export const getHospitalsById = async (req, res) => {
//   const hospital_id = req.params.hospital_id;
//   req.db.query(
//     `SELECT * FROM hospitals WHERE hospital_id = ?`,
//     [hospital_id],
//     (error, hospitalResults) => {
//       if (error) {
//         console.error("Error executing query: " + error.stack);
//         res.status(500).json({ error: "Internal server error" });
//         return;
//       }
//       if (hospitalResults.length === 0) {
//         res.status(404).json({ error: "Hospital not found" });
//         return;
//       }

//       const hospital_treatment_ids = hospitalResults[0].hospital_treatment_id;
//       const treatment_ids = hospital_treatment_ids.split(',').map(id => parseInt(id.trim()));

//       req.db.query(
//         `SELECT * FROM treatments WHERE treatment_id IN (?)`,
//         [treatment_ids],
//         (error, treatmentResults) => {
//           if (error) {
//             console.error("Error executing query: " + error.stack);
//             res.status(500).json({ error: "Internal server error" });
//             return;
//           }

//           const response = {
//             hospital: hospitalResults[0],
//             treatments: treatmentResults
//           };

//           res.json(response);
//         }
//       );
//     }
//   );
// };





export const getHospitalsByName = async (req, res) => {
  const hospital_name = req.params.hospital_name;
  req.db.query(
    "SELECT * FROM hospitals WHERE hospital_name = ?",
    [hospital_name],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Hospital not found" });
        return;
      }
      res.json(results[0]);
    }
  );
};

export const getHospitalsByAddress = async (req, res) => {
  const hospital_address = req.params.hospital_address;
  req.db.query(
    "SELECT * FROM hospitals WHERE hospital_address = ?",
    [hospital_address],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Hospital not found" });
        return;
      }
      res.json(results[0]);
    }
  );
};

export const addHospital = async (req, res) => {
  const {
    hospital_name,
    hospital_phone_number,
    hospital_email,
    hospital_address,
    hospital_rating,
    hospital_treatments,
    hospital_facilities,
  } = req.body;
  if (
    !hospital_name ||
    !hospital_phone_number ||
    !hospital_email ||
    !hospital_address ||
    !hospital_rating ||
    !hospital_treatments ||
    !hospital_facilities
  ) {
    return res
      .status(400)
      .json({
        error:
          "Name, phone number, email, address, rating, treatments, and facilities are required",
      });
  }

  const query =
    "INSERT INTO hospitals (hospital_name, hospital_phone_number, hospital_email, hospital_address, hospital_rating, hospital_treatments, hospital_facilities) VALUES (?, ?, ?, ?, ?, ?, ?)";
  req.db.query(
    query,
    [
      hospital_name,
      hospital_phone_number,
      hospital_email,
      hospital_address,
      hospital_rating,
      hospital_treatments,
      hospital_facilities,
    ],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Hospital added successfully" });
    }
  );
};

export const updateHospital = async (req, res) => {
  const hospital_id = req.params.hospital_id;
  const {
    hospital_name,
    hospital_phone_number,
    hospital_email,
    hospital_address,
    hospital_rating,
    hospital_treatments,
    hospital_facilities,
  } = req.body;
  if (
    !hospital_name ||
    !hospital_phone_number ||
    !hospital_email ||
    !hospital_address ||
    !hospital_rating ||
    !hospital_treatments ||
    !hospital_facilities
  ) {
    return res
      .status(400)
      .json({
        error:
          "Name, phone number, email, address, rating, treatments, and facilities are required",
      });
  }

  const query =
    "UPDATE hospitals SET hospital_name = ?, hospital_phone_number = ?, hospital_email = ?, hospital_address = ?, hospital_rating = ?, hospital_treatments = ?, hospital_facilities = ? WHERE hospital_id = ?";
  req.db.query(
    query,
    [
      hospital_name,
      hospital_phone_number,
      hospital_email,
      hospital_address,
      hospital_rating,
      hospital_treatments,
      hospital_facilities,
      hospital_id,
    ],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Hospital updated successfully" });
    }
  );
};

export const deleteHospital = async (req, res) => {
  const hospital_id = req.params.hospital_id;
  req.db.query(
    "DELETE FROM hospitals WHERE hospital_id = ?",
    [hospital_id],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Hospital deleted successfully" });
    }
  );
};


export const addUserTreatmentInHospital = async (req, res) => {
  const { treatment_id, hospital_id } = req.params;
  const { user } = req.authData;
  const {
    firstName,
    surname,
    guardianName,
    aadharNumber,
    dateOfBirth,
    age,
    gender,
    email,
    phone,
    placeOfBirth,
    city,
    district,
    state,
    disability,
    dateOfBooking,
    appointmentDate
  } = req.body;

  // Check if all required fields are provided
  if (
    !firstName ||
    !surname ||
    !guardianName ||
    !aadharNumber ||
    !dateOfBirth ||
    !age ||
    !gender ||
    !email ||
    !phone ||
    !placeOfBirth ||
    !city ||
    !district ||
    !state ||
    !disability ||
    !dateOfBooking ||
    !appointmentDate
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const query = `
    INSERT INTO user_hospital_treatment_booking (
      user_id, treatment_id, hospital_id, firstName, surname, guardianName, aadharNumber,
      dateOfBirth, age, gender, email, phone, placeOfBirth, city, district, state,
      disability, dateOfBooking, appointmentDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  req.db.query(
    query,
    [
      user.id,
      treatment_id,
      hospital_id,
      firstName,
      surname,
      guardianName,
      aadharNumber,
      dateOfBirth,
      age,
      gender,
      email,
      phone,
      placeOfBirth,
      city,
      district,
      state,
      disability,
      dateOfBooking,
      appointmentDate
    ],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ message: "Treatment added successfully" });
    }
  );
};


export const getTreatmentsById = async (req, res) => {
  const treatment_id = req.params.treatment_id;
  req.db.query(
    "SELECT * FROM treatments WHERE treatment_id = ?",
    [treatment_id],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results[0]);
    }
  );
};



export const getHospitalsByArray = async (req, res) => {
  const hospital_ids = req.body.hospital_ids;
  req.db.query(
    "SELECT * FROM hospitals WHERE hospital_id IN (?)",
    [hospital_ids],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    }
  );
};

export const getTreatmentsByArray = async (req, res) => {
  const treatment_ids = req.body.treatment_ids;
  req.db.query(
    "SELECT * FROM treatments WHERE treatment_id IN (?)",
    [treatment_ids],
    (error, results) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    }
  );
};