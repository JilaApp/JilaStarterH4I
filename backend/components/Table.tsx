import React, { useState } from 'react';

interface DataRowItem {
    [key : string]: [string | number, string] | React.ReactNode;
}

interface TableProps {
    data: DataRowItem[];
}

// TODOs
// styling for individual items
// add actions column with edit/delete


export default function Table({data} : TableProps){

    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handleCheckboxChange = (id : number) => {
        setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.includes(id)) {
            console.log("Unselected," + id)
            console.log(prevSelectedRows);
            return prevSelectedRows.filter((rowId) => rowId !== id);
        } else {
            console.log("Selected, " + id)
            console.log(prevSelectedRows);
            return [...prevSelectedRows, id];
        }
        });
    };

  // each thing in data should be a "tuple" with the value and its corresponding styling

  const columnHeaders = Object.keys(data[0]);

  console.log(data)

    return (
        <table className="bg-white-400 rounded-3xl m-20 border-collapse">
            <thead>
                <tr className="border-b-2 border-gray-400">
                    {columnHeaders.map((header, index) => (
                        <th key={index} className={index === 0 ? "pl-10 pr-10text-left" : "pl-10 pr-10 p-3 text-left"}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="font-medium">
                {data.map((row, index) => (
                <tr key={index}>
                    <td className="pl-10 pr-10 p-4 font-semibold">
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
                    {columnHeaders.slice(1).map((key, cellIndex) => (
                        <td key={cellIndex} className={`pl-10 pr-10 p-4 ${row[key][1]}`}>
                            {row[key][0]}
                        </td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
    )
}