import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { DataRow, ColumnDefinition } from "@/lib/types";

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
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<number | string, HTMLButtonElement>>(new Map());

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
    <div className="flex flex-col h-full rounded-t-[20px] overflow-hidden">
      <div className="overflow-auto flex-1">
        <table className="bg-white-400 border-collapse w-full">
          <thead className="sticky top-0 bg-white-400 z-10">
            <tr className="border-b-2 border-gray-300">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={
                    index === 0
                      ? "pl-16 pr-6 p-4 text-left text-gray-300"
                      : "px-6 p-4 text-left text-gray-300"
                  }
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 p-4 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.id)}
                className="bg-white-400 hover:bg-gray-200 cursor-pointer"
              >
                {columns.map((col, cellIndex) => {
                  const value = row[col.accessorKey];
                  return (
                    <td
                      key={cellIndex}
                      className={
                        cellIndex === 0
                          ? "pl-5 pr-6 p-4 font-semibold"
                          : "px-6 p-4"
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
                <td className="px-6 p-4 relative text-center">
                  <button
                    ref={(el) => {
                      if (el) buttonRefs.current.set(row.id, el);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuPosition({
                        top: rect.bottom + 5,
                        left: rect.right - 110,
                      });
                      setOpenMenu(openMenu === row.id ? null : row.id);
                    }}
                    className="p-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenu === row.id && menuPosition && (
                    <div
                      ref={menuRef}
                      className="fixed w-28 bg-white rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] z-[100]"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                      }}
                    >
                      <img
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
      </div>
    </div>
  );
}
