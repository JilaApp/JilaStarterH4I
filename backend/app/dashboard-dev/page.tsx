"use client";

import { Video, MessageCircle } from "lucide-react";
import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeaderDropdown from "@/components/HeaderDropdown";
import FilterBar from "@/components/FilterBar";
import Tabs from "@/components/Tabs";
import Table, { ColumnDefinition, DataRow } from "@/components/Table";
import TopicTag, { TopicVariant } from "@/components/TopicTag";

interface ServiceData extends DataRow {
  id: number | string;
  title: string;
  topic: string;
  phoneNumber: string;
  link: string;
}

export default function DashboardDev() {
  const [selectedOptions, setSelectedOptions] = useState([
    "Career",
    "Legal",
    "Medical",
    "Transport",
  ]);

  const vrtableData: ServiceData[] = [
    {
      id: "loans",
      title: "How to Take Out a Loan",
      topic: "Legal",
      phoneNumber: "217-403-6150",
      link: "https://www.google.com/",
    },
    {
      id: "use-bus-system",
      title: "How to Use the Bus System",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://www.mtd.com/",
    },
    {
      id: "driver-license",
      title: "How to Get a Driver's License",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://mckinley.illinois.edu/",
    },
    {
      id: "health-insurance",
      title: "How to Get Health Insurance",
      topic: "Medical",
      phoneNumber: "217-403-6150",
      link: "https://www.safe.com/",
    },
  ];

  const sstableData: ServiceData[] = [
    {
      id: 1,
      title: "C-U at Home",
      topic: "Food",
      phoneNumber: "217-403-6150",
      link: "https://leetcode.com/",
    },
    {
      id: "food-pantry",
      title: "Food Pantries",
      topic: "Food",
      phoneNumber: "676-403-6150",
      link: "https://www.c-uphd.org/food-pantries-in-champaign-county.html",
    },
    {
      id: "low-bar-shelter",
      title: "Strides Low Barrier Shleter",
      topic: "Food",
      phoneNumber: "217-403-6150",
      link: "https://www.google.com/",
    },
    {
      id: "mtd-bus-system-2",
      title: "MTD Bus System",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://www.buzzfeed.com/",
    },
    {
      id: "safe-ride",
      title: "Safe Rides",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://www.safe.com/",
    },
    {
      id: "safe-walk",
      title: "Safe Walks",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://www.safe.com/",
    },
    {
      id: 3,
      title: "Carle Hospital",
      topic: "Medical",
      phoneNumber: "217-403-6150",
      link: "https://carle.org/",
    },
    {
      id: 4,
      title: "McKinley Health Center",
      topic: "Medical",
      phoneNumber: "217-403-6150",
      link: "https://mckinley.illinois.edu/",
    },
    {
      id: 5,
      title: "Official Hackensack Hospital",
      topic: "Medical",
      phoneNumber: "217-676-6770",
      link: "https://www.hackensackmeridianhealth.org/en/locations/hackensack-university-medical-center",
    },
  ];

  const columns: ColumnDefinition<ServiceData>[] = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Topic",
      accessorKey: "topic",
      cell: (value) => <TopicTag variant={value as TopicVariant} />,
    },
    {
      header: "Phone number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Link",
      accessorKey: "link",
      cell: (value) => (
        <a
          className="text-jila-400"
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {new URL(String(value)).hostname}
        </a>
      ),
    },
  ];

  const getDataItemById = (id: number | string) =>
    tableData.find((item) => item.id === id);

  const handleRowClick = (id: number | string) => {
    const item = getDataItemById(id);
    console.log("Row Clicked:", item);
  };

  const handleEdit = (id: number | string) => {
    const item = getDataItemById(id);
    console.log("Editing:", item);
  };

  const handleDelete = (id: number | string) => {
    const item = getDataItemById(id);
    console.log("Deleting:", item);
  };

  const tabs = [
    {
      header: { logo: <Video />, text: "Video Resources" },
      content: (
        <Table
          data={vrtableData}
          columns={columns}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleRowClick={handleRowClick}
        />
      ),
    },
    {
      header: { logo: <MessageCircle />, text: "Social Services" },
      content: (
        <Table
          data={sstableData}
          columns={columns}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleRowClick={handleRowClick}
        />
      ),
    },
  ];

  // This starts on index 1 (second tab)
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  return (
    <div className="flex min-h-screen bg-cream-300 mb-15 flex justify-start">
      <Sidebar
        activeButton={null}
        setActiveButton={function (id: string | null): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="flex flex-col">
        <div className="items-center">
          <Header
            name="Sophia Kim"
            organization="Hack4Impact"
            title="Your JILA! Dashboard"
          />
        </div>

        <div className="flex flex-row justfy-start mt-10 ml-10">
          <FilterBar
            options={["Career", "Legal", "Medical", "Transport"]}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
        </div>

        <div className="mt-10">
          <Tabs
            tabs={tabs}
            activeIndex={currentTabIndex}
            onTabChange={setCurrentTabIndex}
          />
        </div>
      </div>
    </div>
  );
}
