import React, { useState } from "react";

const Part = () => {
  const productsData = [
    {
      id: 1,
      name: "Floral Print Wrap Dress",
      image:
        "https://i.pinimg.com/736x/fb/93/63/fb93636ebd337c43e699179d0c0719e8.jpg",
      color: "Blue",
      size: "42",
      price: 20.5,
      quantity: 2,
    },
    {
      id: 2,
      name: "Floral Print Wrap Dress",
      image: "https://www.lulus.com/images/product/xlarge/3074590_453292.jpg",
      color: "Red",
      size: "42",
      price: 30.5,
      quantity: 1,
    },
  ];

  const [products, setProducts] = useState(productsData);
  const [discount, setDiscount] = useState(4.0);
  const [currentPage, setCurrentPage] = useState("shoppingBag");
  const [address, setAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    country: "",
    city: "",
    state: "",
    zip: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const applyDiscount = () => {
    setCurrentPage("address");
  };

  const subtotal = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      {currentPage === "shoppingBag" && (
        <ShoppingBag
          products={products}
          updateQuantity={updateQuantity}
          subtotal={subtotal}
          discount={discount}
          applyDiscount={applyDiscount}
          x
        />
      )}
      {currentPage === "address" && (
        <Address
          address={address}
          setAddress={setAddress}
          proceedToCheckout={() => setCurrentPage("checkout")}
          proceedToAddress={() => setCurrentPage("shoppingBag")}
          subtotal={subtotal}
          discount={discount}
          applyDiscount={applyDiscount}
        />
      )}
      {currentPage === "checkout" && (
        <Checkout
          products={products}
          subtotal={subtotal}
          discount={discount}
          address={address}
          setCurrentPage={setCurrentPage}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
      {isDialogOpen && <Dialog onClose={() => setIsDialogOpen(false)} />}
    </div>
  );
};

const ShoppingBag = ({
  products,
  updateQuantity,
  subtotal,
  discount,
  applyDiscount,
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          margin: "100px 0px",
          backgroundColor: "beige",
          width: "100%",
        }}
      >
        <div style={{ marginLeft: "-85%" }}>
          <h2>Shopping Bag</h2> <p>2 items in your bag</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              marginRight: "30px",
              borderRadius: "30px",
              width: "70%",
              fontSize: "14px",
              height: "550px",
            }}
          >
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{ width: "20%", fontSize: "18px", float: "left" }}
                    >
                      Product
                    </th>
                    <th style={{ fontSize: "18px" }}>Price</th>
                    <th style={{ fontSize: "18px" }}>Quantity</th>
                    <th style={{ fontSize: "18px" }}>Total Price </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr>
                      <td
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          padding: "10px",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "150px",
                            height: "200px",
                            marginRight: "0px",
                            borderRadius: "30px",
                          }}
                        />
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              paddingLeft: "30px",
                            }}
                          >
                            <h3 style={{ color: "grey" }}>WOMEN</h3>
                            <h2>{product.name}</h2>
                            <p>Color : {product.color}</p>
                            <p>Size : {product.size}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        ${product.price}
                      </td>
                      <td style={{ padding: "60px", textAlign: "center" }}>
                        <div>
                          <button
                            style={{
                              marginRight: "10px",
                              borderColor: "#cccccc",
                            }}
                            onClick={() =>
                              updateQuantity(product.id, product.quantity - 1)
                            }
                          >
                            -
                          </button>
                          {product.quantity}
                          <button
                            style={{
                              marginLeft: "10px",
                              borderColor: "#cccccc",
                            }}
                            onClick={() =>
                              updateQuantity(product.id, product.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          color: "orange",
                        }}
                      >
                        ${product.price * product.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              width: "20%",
            }}
          >
            <div style={{ borderBottom: "1px solid " }}>
              <h2>Calculated Shipping</h2>
              <p
                style={{
                  backgroundColor: "#cccccc",
                  padding: "10px",
                  borderRadius: "30px",
                }}
              >
                Country
              </p>
              <div style={{ display: "flex" }}>
                <p
                  style={{
                    backgroundColor: "#cccccc",
                    padding: "10px",
                    borderRadius: "30px",
                    width: "45%",
                    marginRight: "5px",
                  }}
                >
                  State/City
                </p>
                <p
                  style={{
                    padding: "10px",
                    borderRadius: "30px",
                    border: "1px solid black",
                    width: "50%",
                    textAlign: "center",
                  }}
                >
                  Zip Code
                </p>
              </div>
              <p
                style={{
                  backgroundColor: "#000",
                  color: "white",
                  padding: "10px",
                  borderRadius: "30px",
                  width: "100%",
                  marginRight: "5px",
                  textAlign: "center",
                }}
              >
                Update
              </p>
            </div>
            <div>
              <div style={{ borderBottom: "1px solid " }}>
                <h2>Coupon Code</h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "orange",
                  padding: "20px",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                <h2>Cart Total</h2>
                <p>Cart Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Discount: -${discount.toFixed(2)}</p>
                <p>Cart Total: ${(subtotal - discount).toFixed(2)}</p>
                <button
                  onClick={applyDiscount}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    padding: "10px",
                    borderRadius: "30px",
                    width: "100%",
                    marginRight: "5px",
                    textAlign: "center",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: "30px" }}>
          <p
            style={{
              border: "1px solid black",
              borderRadius: "50px",
              padding: "10px",
              marginRight: "10px",
            }}
          >
            Free Shipping
          </p>
          <p
            style={{
              border: "1px solid black",
              borderRadius: "50px",
              padding: "10px",
              marginRight: "10px",
            }}
          >
            Contact Us Anytime
          </p>{" "}
          <p
            style={{
              border: "1px solid black",
              borderRadius: "50px",
              padding: "10px",
              marginRight: "10px",
            }}
          >
            Chat With Us
          </p>{" "}
          <p
            style={{
              border: "1px solid black",
              borderRadius: "50px",
              padding: "10px",
              marginRight: "10px",
            }}
          >
            Gift Cards
          </p>
        </div>
      </div>
    </div>
  );
};

const Address = ({
  address,
  setAddress,
  proceedToCheckout,
  proceedToAddress,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "20px",
        margin: "100px 0px",
        backgroundColor: "beige",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: "16px",
          margin: "20px 50px",
          width: "50%",
        }}
      >
        <h2>Shipping Address</h2>
        <label style={{ padding: "20px" }}>
          First Name
          <input
            style={{
              marginLeft: "100px",
              borderColor: "blue",
              padding: "10px 30px",
            }}
            type="text"
            name="firstname"
            value={address.name}
            onChange={handleChange}
          />
        </label>
        <label style={{ padding: "20px" }}>
          Last Name
          <input
            style={{
              marginLeft: "100px",
              borderColor: "blue",
              padding: "10px 30px",
            }}
            type="text"
            name="lastname"
            value={address.name}
            onChange={handleChange}
          />
        </label>
        <label style={{ padding: "20px" }}>
          Address
          <input
            style={{
              marginLeft: "120px",
              borderColor: "blue",
              padding: "10px 30px",
            }}
            type="text"
            name="address"
            value={address.street}
            onChange={handleChange}
          />
        </label>
        <label style={{ padding: "20px" }}>
          Country
          <input
            style={{
              marginLeft: "120px",
              borderColor: "blue",
              padding: "10px 30px",
            }}
            type="text"
            name="country"
            value={address.street}
            onChange={handleChange}
          />
        </label>
        <label style={{ padding: "20px" }}>
          City
          <input
            style={{
              marginLeft: "150px",
              borderColor: "blue",
              padding: "10px 30px",
            }}
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
          />
        </label>
        <label style={{ padding: "20px" }}>
          State
          <input
            style={{
              marginLeft: "140px",
              borderColor: "blue",
              padding: "10px 30px",
            }}
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
          />
        </label>
        <label style={{ padding: "20px" }}>
          ZIP Code
          <input
            style={{
              marginLeft: "110px",
              borderColor: "blue",
              padding: "10px 30px",
            }}
            type="text"
            name="zip"
            value={address.zip}
            onChange={handleChange}
          />
        </label>
        <button
          onClick={proceedToCheckout}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            borderRadius: "30px",
            width: "50%",
            marginTop: "10px",
            marginRight: "5px",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          Proceed to Checkout
        </button>
        <button
          onClick={proceedToAddress}
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "10px",
            borderRadius: "30px",
            width: "50%",
            marginTop: "10px",
            marginRight: "5px",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Cart
        </button>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "500px",
        }}
      >
        <h2>Protect Your Account Info</h2>
        <p>
          Paypal automatically encrypts the confidential information using SSL
          with an encryption key length of 256-bits .
        </p>
        <img
          src="https://th.bing.com/th/id/OIP.0vhAPskQMwoTf_5SjGMgBwHaD5?rs=1&pid=ImgDetMain"
          width={300}
          height={150}
        />
        <img
          src="https://th.bing.com/th/id/OIP.0wahrAdPi09Zg6CgXmsHbgHaCz?rs=1&pid=ImgDetMain"
          width={300}
          height={100}
        />
      </div>
    </div>
  );
};

const Checkout = ({
  products,
  subtotal,
  discount,
  address,
  setCurrentPage,
  setIsDialogOpen,
}) => {
  const total = subtotal - discount;

  return (
    <div
      style={{
        display: "flex",
        padding: "20px",
        margin: "100px 0px",
        backgroundColor: "beige",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          marginRight: "30px",
          borderRadius: "30px",
          marginTop:"100px",
          width: "70%",
          display: "flex",
          flexDirection: "column",
          fontSize: "18px",
          height:"700px"
        }}
      >
        <h2>Payment Information</h2>
        <label>Cardholder Name</label>
        <input
          type="text"
          style={{
            width: "50%",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "#ddd",
            fontSize: "20px",
            margin: "10px 0",
            padding: "10px",
          }}
        />

        <label>Card Number</label>
        <input
          type="text"
          style={{
            width: "50%",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "#ddd",
            fontSize: "20px",
            margin: "10px 0",
            padding: "10px",
          }}
        />
        <label>Exp. Date </label>
        <div display="flex">
          <input
            type="text"
            placeholder="Month"
            style={{
              width: "30%",
              borderRadius: "50px",
              border: "none",
              backgroundColor: "#ddd",
              fontSize: "20px",
              margin: "20px 10px 0 0 ",
              paddingLeft: "20px",
              padding: "10px",
            }}
          />
          <input
            type="text"
            placeholder="Year"
            style={{
              width: "30%",
              borderRadius: "50px",
              border: "none",
              backgroundColor: "#ddd",
              fontSize: "20px",
              margin: "10px 0",
              paddingLeft: "20px",
              padding: "10px",
            }}
          />
        </div>
        <label>CVV</label>
        <input
          type="text"
          style={{
            width: "30%",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "#ddd",
            fontSize: "20px",
            margin: "20px 10px 0 0 ",
            paddingLeft: "20px",
            padding: "10px",
          }}
        />
        <button
          onClick={() => setIsDialogOpen(true)}
          style={{
            backgroundColor: "orange",
            color: "white",
            padding: "10px",
            borderRadius: "30px",
            width: "25%",
            marginTop: "50px",
            marginRight: "5px",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          Pay ${total.toFixed(2)}
        </button>
        <button
          onClick={() => setCurrentPage("address")}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            borderRadius: "30px",
            width: "25%",
            marginTop: "50px",
            marginRight: "5px",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Address
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "35%" }}>
        <div style={{ marginLeft: "350px" }}>
          <h2 style={{ marginLeft: "20px" }}>Summary</h2>
          <p>2 items in your bag</p>
        </div>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              marginBottom: "20px",
              display: "flex",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "30px",
              fontSize: "14px",
            }}
          >
            <img
              src={product.image}
              style={{ width: "200px", height: "300px", borderRadius: "20px" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "20px",
                fontSize: "16px",
              }}
            >
              <p>{product.name}</p>
              <p style={{ color: "orange", fontSize: "20px" }}>$ {total}</p>
              <p>Color : {product.color} </p>
              <p>Size : {product.size} </p>
              <p>Qty : {product.quantity}</p>
            </div>
          </div>
        ))}
        <div
          style={{
            padding: "20px",
            fontSize: "16px",
            borderTop: "1px solid #ddd",
          }}
        >
          <p>
            Cart Subtotal:{" "}
            <p style={{ marginTop: "-23px", marginLeft: "300px" }}>
              ${subtotal.toFixed(2)}
            </p>
          </p>
          <p>
            Shipping & Handling:{" "}
            <p style={{ marginTop: "-23px", marginLeft: "300px" }}>$5.00</p>
          </p>
          <p>
            Discount:{" "}
            <p style={{ marginTop: "-23px", marginLeft: "300px" }}>
              -${discount.toFixed(2)}
            </p>
          </p>
          <p>
            Cart Total:{" "}
            <p style={{ marginTop: "-23px", marginLeft: "300px" }}>
              ${(total + 5).toFixed(2)}
            </p>
          </p>
          <h3>Shipment Address</h3>
          <p>
            {address.firstname} {address.lastname} , {address.address},{" "}
            {address.city}, {address.state}, {address.zip}
          </p>{" "}
          <button
            onClick={() => setIsDialogOpen(true)}
            style={{
              backgroundColor: "orange",
              color: "white",
              padding: "10px",
              borderRadius: "30px",
              width: "100%",
              marginTop: "30px",
              marginRight: "5px",
              textAlign: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            Pay ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dialog = ({ onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <h2>Payment Confirmation</h2>
        <p style={{ color: "green" }}>
          Your payment has been processed successfully !!!
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            borderRadius: "30px",
            width: "30%",
            marginRight: "5px",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Part;
