
export const addDoctorAndPatient = (req, res) => {

    const { doctor, patient } = req.body;

    if (!doctor || !patient) {
        return res.status(400).json({ message: 'Doctor and Patient are required' });
    }

    const query = "INSERT INTO assigned (doctor, patient) VALUES (?, ?)";
    req.db.query(query, [doctor, patient], (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Doctor and Patient assigned successfully' });
    });
}

export const getDoctorAndPatient = (req, res) => {
    const query = "SELECT * FROM assigned";
    req.db.query(query, (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
}

export const getDoctorByPatient = (req, res) => {
    // Get the patient from the body
    const { patient } = req.body;

    if (!patient) {
        return res.status(400).json({ message: 'Patient is required' });
    }

    const query = "SELECT * FROM assigned WHERE patient = ?";
    req.db.query(query, [patient], (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
}

export const getPatientByDoctor = (req, res) => {
    const { doctor } = req.body;

    if (!doctor) {
        return res.status(400).json({ message: 'Doctor is required' });
    }

    const query = "SELECT * FROM assigned WHERE doctor = ?";
    req.db.query(query, [doctor], (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
}