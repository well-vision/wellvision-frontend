import React from "react";

const CustomerCard = ({ customer, onClick }) => {
  return (
    <div
      className="customer-card"
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        margin: "10px",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <h3>
        {customer.givenName} {customer.familyName}
      </h3>
      <p>📞 {customer.phoneNo}</p>
      <p>📧 {customer.email}</p>
      <p>🗓️ Age: {customer.ageYears}</p>
    </div>
  );
};

export default CustomerCard;
