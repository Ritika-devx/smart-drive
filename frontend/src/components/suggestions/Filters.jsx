import { useState } from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

function Filters({ onFilter }) {
  const [category, setCategory] = useState("");

  const handleFilter = (e) => {
    const value = e.target.value;

    setCategory(value);
    onFilter(value);
  };

  return (
    <div className="filter-container">

      <div className="filter-box">

        <HiOutlineAdjustmentsHorizontal className="filter-icon" />

        <select
          className="filter-select"
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

    </div>
  );
}

export default Filters;