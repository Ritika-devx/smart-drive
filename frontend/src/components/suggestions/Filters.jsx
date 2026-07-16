import { useState } from "react";

function Filters({ onFilter }) {

  const [category, setCategory] = useState("");

  const handleFilter = (e) => {

    const value = e.target.value;

    setCategory(value);

    onFilter(value);

  };

  return (
    <div style={{ marginBottom: "20px" }}>

      <select
        value={category}
        onChange={handleFilter}
      >
        <option value="">All Categories</option>
        <option value="Image">Image</option>
        <option value="PDF">PDF</option>
        <option value="Document">Document</option>
        <option value="Other">Other</option>
      </select>

    </div>
  );

}

export default Filters;