export const getAllDoctors = async (req, res) => {
    const query = `
        SELECT u.*, d.*, h.*
        FROM users u
        LEFT JOIN doctors_detail d ON u.id = d.doctor_id
        LEFT JOIN hospitals h ON d.doctor_hospital_id = h.hospital_id
        WHERE u.role = 1
    `;

    req.db.query(query, (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json(results);

    });
};







export const getdoctorById = async (req, res) => {
    const doctor_id = req.params.id;
    const query = `
        SELECT u.*, d.*, h.*
        FROM users u
        LEFT JOIN doctors_detail d ON u.id = d.doctor_id
        LEFT JOIN hospitals h ON d.doctor_hospital_id = h.hospital_id
        WHERE u.id = ? AND u.role = 1
    `;
    req.db.query(query, [doctor_id], (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: "Doctor not found" });
            return;
        }
        res.json(results[0]);
    }
    );
};

export const updateDoctor = async (req, res) => {
    const doctor_id = req.params.id;
    const { name, email, password, phone, address } = req.body;
    req.db.query(
        "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, address = ? WHERE id = ? AND role = 1",
        [name, email, password, phone, address, doctor_id],
        (error, results) => {
            if (error) {
                console.error("Error executing query: " + error.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Doctor not found" });
                return;
            }
            res.json({ message: "Doctor updated successfully" });
        }
    );
};


export const updateDoctorByAdmin = async (req, res) => {
    const doctor_id = req.params.id;
    const { name, email, password, phone, address } = req.body;
    req.db.query(
        "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, address = ? WHERE id = ? AND role = 1",
        [name, email, password, phone, address, doctor_id],
        (error, results) => {
            if (error) {
                console.error("Error executing query: " + error.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Doctor not found" });
                return;
            }
            res.json({ message: "Doctor updated successfully" });
        }
    );
};

export const deleteDoctor = async (req, res) => {
    const doctor_id = req.params.id;
    req.db.query(
        "DELETE FROM users WHERE id = ? AND role = 1",
        [doctor_id],
        (error, results) => {
            if (error) {
                console.error("Error executing query: " + error.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Doctor not found" });
                return;
            }
            res.json({ message: "Doctor deleted successfully" });
        }
    );
};

export const deleteDoctorByAdmin = async (req, res) => {
    const doctor_id = req.params.id;
    req.db.query(
        "DELETE FROM users WHERE id = ? AND role = 1",
        [doctor_id],
        (error, results) => {
            if (error) {
                console.error("Error executing query: " + error.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Doctor not found" });
                return;
            }
            res.json({ message: "Doctor deleted successfully" });
        }
    );
};


export const addAppointment = async (req, res) => {
    const {
        fullName,
        dateOfBirth,
        gender,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        zipCode,
        reasonForAppointment,
        pastTreatmentFiles,
        slotDate,
        timeSlot,
    } = req.body;

    const { user } = req.authData;
    const user_id = [user.id];

    const doctor_id = req.params.doctor_id;

    console.log("doctor_id", doctor_id); // "doctor_id 1
    console.log(req.body);

    const query = `
    INSERT INTO appointments (
        user_id,
        fullName,
        dateOfBirth,
        gender,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        zipCode,
        reasonForAppointment,
        pastTreatmentFiles,
        slotDate,
        timeSlot,
        doctor_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    req.db.query(query, [
        user_id,
        fullName,
        dateOfBirth,
        gender,
        email,
        phoneNumber,
        streetAddress,
        city,
        state,
        zipCode,
        reasonForAppointment,
        pastTreatmentFiles,
        slotDate,
        timeSlot,
        doctor_id
    ], (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "Appointment added successfully" });
    });
};

