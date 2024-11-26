export const getAllProducts = async (req, res) => {
    req.db.query("SELECT * FROM products", (error, results) => {
        if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
        }
        res.json(results);
    });
    };


    export const getProductById = async (req, res) => {
        const product_id = req.params.product_id;
    
        try {
            // Query to get product details
            const productQuery = "SELECT * FROM products WHERE product_id = ?";
            const productResults = await new Promise((resolve, reject) => {
                req.db.query(productQuery, [product_id], (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                });
            });
    
            if (productResults.length === 0) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
    
            // Query to get product images
            const imagesQuery = "SELECT * FROM product_images WHERE product_id = ?";
            const imagesResults = await new Promise((resolve, reject) => {
                req.db.query(imagesQuery, [product_id], (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                });
            });
    
            // Combine product details with images
            const product = productResults[0];
            product.images = imagesResults;
    
            res.json(product);
        } catch (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    export const getProductByArrayOfIds = async (req, res) => {
        const product_ids = req.body.product_ids;
        // console.log(product_ids);
        req.db.query(
            "SELECT * FROM products WHERE product_id IN (?)",
            [product_ids],
            (error, results) => {
            if (error) {
                console.error("Error executing query: " + error.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            res.json(results);
            }
        );
    };


    
// export const getProductById = async (req, res) => {
//     const product_id = req.params.product_id;
//     req.db.query(
//         "SELECT * FROM products WHERE product_id = ?",
//         [product_id],
//         (error, results) => {
//         if (error) {
//             console.error("Error executing query: " + error.stack);
//             res.status(500).json({ error: "Internal server error" });
//             return;
//         }
//         if (results.length === 0) {
//             res.status(404).json({ error: "Product not found" });
//             return;
//         }
//         res.json(results[0]);
//         }
//     );
// };

export const addTocart = async (req, res) => {
    const product_id = req.params.product_id;
    const user_id = req.user.user_id;
    req.db.query(
        "INSERT INTO cart (product_id, user_id) VALUES (?, ?)",
        [product_id, user_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "Product added to cart" });
        }
    );
};

export const getCart = async (req, res) => {
    const user_id = req.user.user_id;
    req.db.query(
        "SELECT * FROM cart WHERE user_id = ?",
        [user_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json(results);
        }
    );
};

export const removeFromCart = async (req, res) => {
    const product_id = req.params.product_id;
    const user_id = req.user.user_id;
    req.db.query(
        "DELETE FROM cart WHERE product_id = ? AND user_id = ?",
        [product_id, user_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "Product removed from cart" });
        }
    );
};

export const addProduct = async (req, res) => {
    const { product_name, product_price, product_quantity } = req.body;
    req.db.query(
        "INSERT INTO products (product_name, product_price, product_quantity) VALUES (?, ?, ?)",
        [product_name, product_price, product_quantity],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "Product added" });
        }
    );
};

export const updateProduct = async (req, res) => {
    const product_id = req.params.product_id;
    const { product_name, product_price, product_quantity } = req.body;
    req.db.query(
        "UPDATE products SET product_name = ?, product_price = ?, product_quantity = ? WHERE product_id = ?",
        [product_name, product_price, product_quantity, product_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "Product updated" });
        }
    );
};

export const deleteProduct = async (req, res) => {
    const product_id = req.params.product_id;
    req.db.query(
        "DELETE FROM products WHERE product_id = ?",
        [product_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "Product deleted" });
        }
    );
};

export const buyProduct = async (req, res) => {
        const user_id = req.user.user_id;
        const product_id = req.body.product_id;

        req.db.query(
            "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
            [user_id, product_id],
            (error, results) => {
            if (error) {
                console.error("Error executing query: " + error.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            if (results.length === 0) {
                res.status(404).json({ error: "Product not found in cart" });
                return;
            }
            req.db.query(
                "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
                [user_id, product_id],
                (error, results) => {
                if (error) {
                    console.error("Error executing query: " + error.stack);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }
                res.json({ message: "Product bought" });
                }
            );
            }
        );
};

export const cancelProduct = async (req, res) => {
    const user_id = req.user.user_id;
    const product_id = req.body.product_id;
    req.db.query(
        "INSERT INTO cart (product_id, user_id) VALUES (?, ?)",
        [product_id, user_id],
        (error, results) => {
        if (error) {
            console.error("Error executing query: " + error.stack);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json({ message: "Product cancelled" });
        }
    );
};





