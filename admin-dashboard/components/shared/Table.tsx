import React, { useState, useRef } from "react";
import Image from "next/image";
import { MoreVertical, Check, X as XIcon, ChevronsUpDown } from "lucide-react";
import type { DataRow, ColumnDefinition, SortConfig } from "@/lib/types";
import { useClickOutside } from "@/hooks/useClickOutside";
import clsx from "clsx";

interface TableProps<T extends DataRow> {
  data: T[];
  columns: ColumnDefinition<T>[];
  handleEdit?: (id: T["id"]) => void;
  handleDelete?: (id: T["id"]) => void;
  handleApprove?: (id: T["id"]) => void;
  handleDeny?: (id: T["id"]) => void;
  handleRowClick: (id: T["id"]) => void;
  selectedRows?: number[];
  onSelectedRowsChange?: (selectedRows: number[]) => void;
  emptyState?: React.ReactNode;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
}

export default function Table<T extends DataRow>({
  data,
  columns,
  handleEdit,
  handleDelete,
  handleApprove,
  handleDeny,
  handleRowClick,
  selectedRows: externalSelectedRows,
  onSelectedRowsChange,
  emptyState,
  sortConfig,
  onSort,
}: TableProps<T>) {
  const [internalSelectedRows, setInternalSelectedRows] = useState<number[]>(
    [],
  );

  const selectedRows =
    externalSelectedRows !== undefined
      ? externalSelectedRows
      : internalSelectedRows;
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useClickOutside(menuRef, () => setOpenMenu(null));

  const handleCheckboxChange = (id: number) => {
    if (onSelectedRowsChange) {
      const newSelection = selectedRows.includes(id)
        ? selectedRows.filter((rowId: number) => rowId !== id)
        : [...selectedRows, id];
      onSelectedRowsChange(newSelection);
    } else {
      setInternalSelectedRows((prevSelectedRows: number[]) => {
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter((rowId: number) => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full rounded-t-[20px] overflow-hidden">
      <div className="overflow-auto flex-1">
        <table className="bg-white-400 border-collapse w-full">
          <thead className="sticky top-0 bg-white-400 z-10">
            <tr className="border-b-2 border-gray-300">
              {columns.map((col, index) => (
                <th
                  key={String(col.accessorKey)}
                  className={
                    index === 0
                      ? "pl-16 pr-6 p-4 text-left text-gray-300"
                      : "px-6 p-4 text-left text-gray-300"
                  }
                >
                  {col.sortable && onSort ? (
                    <button
                      onClick={() => onSort(String(col.accessorKey))}
                      className="flex items-center gap-2 hover:opacity-70 cursor-pointer"
                    >
                      <span>{col.header}</span>
                      <ChevronsUpDown size={24} className="text-gray-300" />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
              <th className="px-6 p-4 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {data.length === 0 && emptyState ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-0 h-full align-top"
                >
                  <div className="bg-white h-[600px] flex items-center justify-center">
                    {emptyState}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  className={clsx("cursor-pointer border-t", {
                    "bg-cream-400 border-error-200 border-b":
                      selectedRows.includes(row.id),
                    "bg-white-400 hover:bg-gray-200 border-transparent":
                      !selectedRows.includes(row.id),
                  })}
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
                            className="w-4 h-4 mr-6 align-middle accent-jila-400 cursor-pointer"
                          />
                        )}
                        <span className="align-middle">
                          {col.cell ? col.cell(value) : String(value)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-6 p-4 relative text-center">
                    {handleApprove && handleDeny ? (
                      <div className="flex items-center justify-center gap-[20px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(row.id);
                          }}
                          className="hover:opacity-80 cursor-pointer"
                        >
                          <Check size={24} className="text-green-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeny(row.id);
                          }}
                          className="hover:opacity-80 cursor-pointer"
                        >
                          <XIcon size={24} className="text-error-400" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          ref={(el) => {
                            if (el) buttonRefs.current.set(row.id, el);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect =
                              e.currentTarget.getBoundingClientRect();
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
                            <Image
                              src="/table-menu-tail.svg"
                              alt="tail"
                              width={100}
                              height={100}
                              className="absolute top-[-50px] right-[-34px] origin-center block pointer-events-none"
                            />
                            {handleEdit && (
                              <button
                                onClick={() => {
                                  handleEdit(row.id);
                                  setOpenMenu(null);
                                }}
                                className="block w-full text-left px-4 py-2 hover:text-gray-300 cursor-pointer rounded-md"
                              >
                                Edit
                              </button>
                            )}
                            {handleDelete && (
                              <button
                                onClick={() => {
                                  handleDelete(row.id);
                                  setOpenMenu(null);
                                }}
                                className="block w-full text-left px-4 py-2 hover:text-gray-300 cursor-pointer rounded-md"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
