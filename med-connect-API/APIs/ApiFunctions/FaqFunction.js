export const getFaq = async (req, res) => {
    try {
        req.db.query("SELECT * FROM faqs", (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json(results);
        });
    } catch (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
    };

export const getFaqById = async (req, res) => {
    const faq_id = req.params.faq_id;
    req.db.query(
        "SELECT * FROM faqs WHERE faq_id = ?",
        [faq_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: "FAQ not found" });
            return;
        }
        res.json(results[0]);
        }
    );
    }

export const addFaq = async (req, res) => {
    const { name, email, question } = req.body;

    // Validate the input
    if (!name || !email || !question) {
        res.status(400).json({ error: "Name, email, and question are required" });
        return;
    }

    try {
        // Use a promise-based approach for database queries
        const results = await new Promise((resolve, reject) => {
            req.db.query(
                "INSERT INTO faqs (name, email, question) VALUES (?, ?, ?)",
                [name, email, question],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                }
            );
        });

        // Send a success response
        res.json({ message: "FAQ added successfully" });
    } catch (error) {
        // Log and send an error response
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const updateFaq = async (req, res) => {

    const faq_id = req.params.faq_id;
    const { question, answer } = req.body;
    req.db.query(
        "UPDATE faqs SET question = ?, answer = ? WHERE faq_id = ?",
        [question, answer, faq_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "FAQ updated successfully" });
        }
    );
    }

export const deleteFaq = async (req, res) => {

    const faq_id = req.params.faq_id;
    req.db.query(
        "DELETE FROM faqs WHERE faq_id = ?",
        [faq_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "FAQ deleted successfully" });
        }
    );
    }

