import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

interface DataRowItem {
  [key: string]: [string | number, string] | React.ReactNode;
}

interface TableProps {
  data: DataRowItem[];
  edit_func: (index : number) => void;
  delete_func: (index: number) => void;
}

export default function Table({ data, edit_func, delete_func }: TableProps) {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        console.log("Unselected," + id);
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        console.log("Selected, " + id);
        return [...prevSelectedRows, id];
      }
    });
  };

  const columnHeaders = Object.keys(data[0]);

  return (
    <table className="bg-white-400 rounded-3xl m-20 border-collapse">
      {/* headers */}
      <thead>
        <tr className="border-b-2 border-gray-300">
          {columnHeaders.map((header, index) => (
            <th
              key={index}
              className={
                index === 0
                  ? "pl-20 text-left text-gray-300"
                  : "pl-6 pr-20 p-4 text-left text-gray-300"
              }
            >
              {header}
            </th>
          ))}
          <th className="pl-10 pr-10 p-3 text-left text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody className="font-medium">
        {data.map((row, index) => (
          <tr key={index} className="bg-white-400 hover:bg-gray-300 cursor-pointer">
            <td className="pl-10 pr-10 p-4 font-semibold">
              {/* displays checkbox and 1st column */}
              <label>
                <input
                  id={`${index}`}
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                  className="w-4 h-4 mr-6"
                />
                {row[columnHeaders[0]]}
              </label>
            </td>
            {/* displays rest of columns */}
            {columnHeaders.slice(1).map((key, cellIndex) =>
              typeof row[key] === "object" && React.isValidElement(row[key]) ? (
                <td key={cellIndex} className="pl-6">
                  {row[key]}
                </td>
              ) : (
                <td
                  key={cellIndex}
                  className={`p-6 pl-6 pr-6 ${Array.isArray(row[key]) ? row[key][1] : ""}`}
                >
                  {Array.isArray(row[key]) ? row[key][0] : ""}
                </td>
              ),
            )}
            {/* actions column w kebab menu */}
            <td className="p-3 relative text-center">
              <button
                onClick={() => setOpenMenu(openMenu === index ? null : index)}
                className="p-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
              >
                <MoreVertical size={18} />
              </button>

              {/* when menu is open */}
              {openMenu === index && (
                <div
                  className="absolute right-12 mt-1 w-28 bg-white rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="absolute left-20 -top-3 w-0 h-0
                                    border-l-10 border-l-transparent
                                    border-r-10 border-r-transparent
                                    border-b-12 border-b-white"
                  ></div>

                  <button
                    onClick={(e) => {
                      edit_func(index);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      delete_func(index);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer rounded-md"
                  >
                    Delete
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
