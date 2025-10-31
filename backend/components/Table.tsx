import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

export interface DataRow {
  id: number | string;
  [key: string]: unknown;
}

export interface ColumnDefinition<
  T extends DataRow,
  K extends keyof T = keyof T,
> {
  header: string;
  accessorKey: K;
  cell?: (value: T[K]) => React.ReactNode;
}

interface TableProps<T extends DataRow> {
  data: T[];
  columns: ColumnDefinition<T>[];
  handleEdit: (id: T["id"]) => void;
  handleDelete: (id: T["id"]) => void;
  handleRowClick: (id: T["id"]) => void;
}

export default function Table<T extends DataRow>({
  data,
  columns,
  handleEdit,
  handleDelete,
  handleRowClick,
}: TableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [openMenu, setOpenMenu] = useState<number | string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const handleCheckboxChange = (id: number | string) => {
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

  return (
    <table className="bg-white-400 rounded-3xl m-20 border-collapse">
      <thead>
        <tr className="border-b-2 border-gray-300">
          {columns.map((col, index) => (
            <th
              key={index}
              className={
                index === 0
                  ? "pl-20 text-left text-gray-300"
                  : "pl-6 pr-20 p-4 text-left text-gray-300"
              }
            >
              {col.header}
            </th>
          ))}
          <th className="pl-10 pr-10 p-3 text-left text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody className="font-medium">
        {data.map((row) => (
          <tr
            key={row.id}
            onClick={() => handleRowClick(row.id)}
            className="bg-white-400 hover:bg-gray-300 cursor-pointer"
          >
            {columns.map((col, cellIndex) => {
              const value = row[col.accessorKey];
              return (
                <td
                  key={cellIndex}
                  className={
                    cellIndex === 0 ? "pl-10 pr-10 p-4 font-semibold" : "pl-6"
                  }
                >
                  {cellIndex === 0 && (
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleCheckboxChange(row.id)}
                      className="w-4 h-4 mr-6 align-middle"
                    />
                  )}
                  <span className="align-middle">
                    {col.cell ? col.cell(value) : String(value)}
                  </span>
                </td>
              );
            })}
            <td className="p-3 relative text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(openMenu === row.id ? null : row.id);
                }}
                className="p-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
              >
                <MoreVertical size={18} />
              </button>
              {openMenu === row.id && (
                <div
                  ref={menuRef}
                  className="absolute right-12 mt-1 w-28 bg-white rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src="/table-menu-tail.svg"
                    alt="tail"
                    style={{
                      position: "absolute",
                      top: "-50px",
                      right: "-34px",
                      width: "100px",
                      height: "100px",
                      transformOrigin: "center",
                      display: "block",
                      pointerEvents: "none",
                    }}
                  />
                  <button
                    onClick={() => {
                      handleEdit(row.id);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:text-gray-300 cursor-pointer rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(row.id);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:text-gray-300 cursor-pointer rounded-md"
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
