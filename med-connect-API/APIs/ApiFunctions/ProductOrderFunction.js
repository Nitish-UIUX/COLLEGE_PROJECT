



export const getAllProductsByCustomerId = async (req, res) => {
  const CustomerID = req.params.customer_id;
  const query = `
        SELECT po.*, p.product_name, p.product_price, p.product_manufacturer, p.product_image, p.product_description, p.product_mrp, p.product_discount, p.product_brand, p.product_category 
        FROM product_orders po
        JOIN products p ON po.ProductID = p.Product_id
        WHERE po.CustomerID = ?
    `;
  req.db.query(query, [CustomerID], (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
};










// Import lodash for random number generation
import { format, addMinutes, addDays } from 'date-fns';
import _ from 'lodash'; // Import lodash for random number generation

// Function to generate random uppercase tracking number
const generateTrackingNumber = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = Array.from({ length: 5 }, () => letters.charAt(_.random(0, letters.length - 1)));
  const randomNumber = _.random(10000, 99999); // Generate random 5-digit number
  return `${randomLetters.join('')}${randomNumber}`;
};

export const addOrderProduct = async (req, res) => {
  try {
    const {
      ProductID,
      CustomerID,
      Quantity,
      ShippingAddress,
      BillingAddress,
      PaymentMethod,
      TotalPrice,
      TaxAmount,
      ShippingCost
    } = req.body;

    

    // Validate input
    if (!CustomerID || !ShippingAddress || !BillingAddress || !PaymentMethod || !TotalPrice || !TaxAmount || !ShippingCost) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Get current date and format it
    const orderDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    // Calculate OrderConfirmationDate (current day but 5 minutes further)
    const orderConfirmationDate = format(addMinutes(new Date(), 1), 'yyyy-MM-dd HH:mm:ss');

    // Calculate EstimatedDeliveryDate (five days in the future)
    const estimatedDeliveryDate = format(addDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss');

    // Calculate ActualDeliveryDate (one day ahead of estimated delivery date)
    const actualDeliveryDate = format(addDays(new Date(estimatedDeliveryDate), 1), 'yyyy-MM-dd HH:mm:ss');

    // Generate TrackingNumber (uppercase letters + five random digits)
    const trackingNumber = generateTrackingNumber();

    // Prepare arrays for multiple products if provided
    const productIds = Array.isArray(ProductID) ? ProductID : [ProductID];
    const quantities = Array.isArray(Quantity) ? Quantity : [Quantity];

    // Validate lengths of ProductID and Quantity arrays
    if (productIds.length !== quantities.length) {
      return res.status(400).json({ error: "ProductID and Quantity arrays must be of the same length" });
    }

    // Prepare an array to hold all insert queries
    const insertQueries = [];

    // Loop through products and create individual insert queries
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      const quantity = quantities[i];

      const query = `
        INSERT INTO product_orders
        (ProductID, CustomerID, Quantity, ShippingAddress, BillingAddress, PaymentMethod, TotalPrice, TaxAmount, ShippingCost, OrderDate, OrderConfirmationDate, EstimatedDeliveryDate, ActualDeliveryDate, TrackingNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      insertQueries.push({
        query,
        values: [
          productId,
          CustomerID,
          quantity,
          ShippingAddress,
          BillingAddress,
          PaymentMethod,
          TotalPrice,
          TaxAmount,
          ShippingCost,
          orderDate,
          orderConfirmationDate,
          estimatedDeliveryDate,
          actualDeliveryDate,
          trackingNumber
        ]
      });
    }

    // Assuming req.db is a valid database connection
    // Execute all insert queries in parallel
    const promises = insertQueries.map(({ query, values }) => {
      return new Promise((resolve, reject) => {
        req.db.query(query, values, (error, results) => {
          if (error) {
            console.error("Error executing query: " + error.stack);
            reject(error);
          } else {
            resolve({ orderId: results.insertId });
          }
        });
      });
    });

    // Wait for all queries to complete
    Promise.all(promises)
      .then((results) => {
        res.status(201).json({ message: "Products ordered", orderIDs: results  });
      })
      .catch((error) => {
        console.error("Error: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
      });

  } catch (error) {
    console.error("Error: " + error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getProductsByOrderId = async (req, res) => {
  const orderIDs = req.body.orderIDs;
//  console.log(orderIDs);

  if (!orderIDs || !Array.isArray(orderIDs)) {
      res.status(400).json({ error: "Invalid orderIDs" });
      return;
  }

  req.db.query(
      `SELECT po.*, p.* 
       FROM product_orders po 
       JOIN products p ON po.ProductID = p.product_id
       WHERE po.OrderID IN (?)`,
      [orderIDs],
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



export const getAllProductsByUsers = async (req, res) => {
    //get all the products ordered by all the users
    const query = `
        SELECT po.*, p.product_name, p.product_price, p.product_manufacturer, p.product_image, p.product_description, p.product_mrp, p.product_discount, p.product_brand, p.product_category, c.customer_name, c.customer_email, c.customer_phone
        FROM product_orders po
        JOIN products p ON po.ProductID = p.Product_id
        JOIN customers c ON po.CustomerID = c.Customer_id
    `;
    req.db.query(query, (error, results) => {
        if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
        }
        res.json(results);
    }
    );
    }
    

export const cancelOrder = async (req, res) => {
    const { OrderID } = req.body;
    const query = "DELETE FROM product_orders WHERE OrderID = ?";
    req.db.query(query, [OrderID], (error, results) => {
        if (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
        }
        res.json({ message: "Order cancelled" });
    });
    }
