import RadioButtonGroup from "../forms/RadioButtonGroup";
import { useState, useMemo, useEffect } from "react";
import { TextInput } from "../ui/Input";
import SearchBar from "../forms/SearchBar";
import { trpc } from "@/lib/trpc";
import { Search } from "lucide-react";
import { JobFilters } from "@/lib/types";
import { DEFAULT_MIN_SALARY, DEFAULT_MAX_SALARY } from "@/lib/constants";
import BaseSideModal from "@/components/shared/BaseSideModal";

interface JobFilterProps {
  onClose: () => void;
  onApply: (filters: JobFilters) => void;
  initialFilters?: JobFilters | null;
}

export default function JobFilter({
  onClose,
  onApply,
  initialFilters,
}: JobFilterProps) {
  const speakerOptions = [
    { name: "Non-English" },
    { name: "Spanish" },
    { name: "Q'anjob'al" },
  ];
  const [selectedSpeakerOptions, setSelectedSpeakerOptions] = useState<
    string[]
  >(initialFilters?.speakerTags || [""]);

  const locationOptions = [
    { name: "Remote" },
    { name: "Hybrid" },
    { name: "In person" },
  ];
  const [selectedLocationOptions, setSelectedLocationOptions] = useState<
    string[]
  >(initialFilters?.locationTypes || [""]);

  const jobTypeOptions = [
    { name: "Internship" },
    { name: "Full-time" },
    { name: "Part-time" },
    { name: "Temporary" },
    { name: "Freelance" },
    { name: "Seasonal" },
  ];
  const [selectedJobTypeOptions, setSelectedJobTypeOptions] = useState<
    string[]
  >(initialFilters?.jobTypes || [""]);

  const [minInput, setMinInput] = useState(
    initialFilters?.minSalary || DEFAULT_MIN_SALARY,
  );
  const [maxInput, setMaxInput] = useState(
    initialFilters?.maxSalary || DEFAULT_MAX_SALARY,
  );

  const handleMaxChange = (stringValue: string) => {
    const numberValue = parseInt(stringValue);

    if (isNaN(numberValue)) {
      setMaxInput(DEFAULT_MAX_SALARY);
    } else {
      setMaxInput(numberValue);
    }
  };

  const handleMinChange = (stringValue: string) => {
    const numberValue = parseInt(stringValue);

    if (isNaN(numberValue)) {
      setMinInput(DEFAULT_MIN_SALARY);
    } else {
      setMinInput(numberValue);
    }
  };

  const [searchQuery, setSearchQuery] = useState(
    initialFilters?.locationSearch || "",
  );
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const { data: allJobs } = trpc.jobs.getAllJobs.useQuery();

  const uniqueLocations = useMemo(() => {
    if (!allJobs) return [];
    const locations = new Set<string>();
    allJobs.forEach((job: { city: string; state: string }) => {
      locations.add(`${job.city}, ${job.state}`);
    });
    return Array.from(locations).sort();
  }, [allJobs]);

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return uniqueLocations;
    return uniqueLocations.filter((location) =>
      location.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [uniqueLocations, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".location-search-container")) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredJobCount = useMemo(() => {
    if (!allJobs) return 0;

    return allJobs.filter(
      (job: {
        locationType: string;
        jobType: string;
        salary: number;
        city: string;
        state: string;
      }) => {
        if (
          selectedLocationOptions.length > 0 &&
          selectedLocationOptions[0] !== ""
        ) {
          const locationMatch = selectedLocationOptions.some((loc) => {
            if (loc === "Remote") return job.locationType === "REMOTE";
            if (loc === "Hybrid") return job.locationType === "HYBRID";
            if (loc === "In person") return job.locationType === "INPERSON";
            return false;
          });
          if (!locationMatch) return false;
        }

        if (
          selectedJobTypeOptions.length > 0 &&
          selectedJobTypeOptions[0] !== ""
        ) {
          const jobTypeMatch = selectedJobTypeOptions.some((type) => {
            const typeUpper = type.toUpperCase().replace(/-/g, "");
            return job.jobType === typeUpper;
          });
          if (!jobTypeMatch) return false;
        }

        if (job.salary < minInput || job.salary > maxInput) {
          return false;
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const fullLocation = `${job.city}, ${job.state}`.toLowerCase();
          if (
            !fullLocation.includes(query) &&
            !job.city.toLowerCase().includes(query) &&
            !job.state.toLowerCase().includes(query)
          ) {
            return false;
          }
        }

        return true;
      },
    ).length;
  }, [
    allJobs,
    selectedLocationOptions,
    selectedJobTypeOptions,
    minInput,
    maxInput,
    searchQuery,
  ]);

  const handleApply = () => {
    onApply({
      speakerTags: selectedSpeakerOptions.filter((opt) => opt !== ""),
      locationTypes: selectedLocationOptions.filter((opt) => opt !== ""),
      jobTypes: selectedJobTypeOptions.filter((opt) => opt !== ""),
      minSalary: minInput,
      maxSalary: maxInput,
      locationSearch: searchQuery,
    });
    onClose();
  };

  const handleClearAll = () => {
    setSelectedSpeakerOptions([""]);
    setSelectedLocationOptions([""]);
    setSelectedJobTypeOptions([""]);
    setMinInput(DEFAULT_MIN_SALARY);
    setMaxInput(DEFAULT_MAX_SALARY);
    setSearchQuery("");

    // Apply empty filters and close modal - don't include salary to avoid filtering
    onApply({
      speakerTags: [],
      locationTypes: [],
      jobTypes: [],
      locationSearch: "",
    });
    onClose();
  };

  const footer = (
    <div className="flex items-center justify-between px-[25px] py-[20px]">
      <div className="text-gray-600">{filteredJobCount} results</div>

      <div className="flex gap-[16px]">
        <button
          onClick={handleClearAll}
          className="text-type-400 hover:text-jila-400 font-medium cursor-pointer"
        >
          Clear all
        </button>

        <button
          onClick={handleApply}
          className="bg-jila-400 hover:bg-type-400 text-white font-bold px-[32px] py-[12px] rounded-[10px] cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <BaseSideModal
      isOpen={true}
      onClose={onClose}
      title="Filters"
      footer={footer}
    >
      <div className="px-[25px] pt-[25px] pb-[120px] flex flex-col gap-[14px]">
        <div className="border-b border-gray-200 flex flex-col gap-[16px] pb-[30px]">
          <div className="font-bold text-lg text-black">Speaker tags</div>
          <RadioButtonGroup
            options={speakerOptions}
            selectedOptions={selectedSpeakerOptions}
            setSelectedOptions={setSelectedSpeakerOptions}
          />
        </div>

        <div className="border-b border-gray-200 flex flex-col gap-[16px] pb-[30px]">
          <div className="font-bold text-lg text-black">Location type</div>
          <RadioButtonGroup
            options={locationOptions}
            selectedOptions={selectedLocationOptions}
            setSelectedOptions={setSelectedLocationOptions}
          />
        </div>

        <div className="border-b border-gray-200 flex flex-col gap-[16px] pb-[30px]">
          <div className="font-bold text-lg text-black">Job type</div>
          <RadioButtonGroup
            options={jobTypeOptions}
            selectedOptions={selectedJobTypeOptions}
            setSelectedOptions={setSelectedJobTypeOptions}
          />
        </div>

        <div className="flex flex-col gap-[16px] relative location-search-container">
          <div className="font-bold text-lg text-black">Location</div>
          <div className="relative w-full">
            <div
              className="bg-white border border-gray-300 flex items-center gap-[7px] h-[60px] px-[16px] rounded-[10px] cursor-text w-full"
              onClick={() => setShowLocationDropdown(true)}
            >
              <Search size={24} className="text-gray-300 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                placeholder="Search by city, state, or zip code"
                className="flex-1 bg-transparent outline-none font-bold text-lg text-type-400 placeholder:text-gray-300"
              />
            </div>
            {showLocationDropdown && filteredLocations.length > 0 && (
              <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-[10px] shadow-lg max-h-[200px] overflow-y-auto z-20">
                {filteredLocations.map((location) => (
                  <div
                    key={location}
                    onClick={() => {
                      setSearchQuery(location);
                      setShowLocationDropdown(false);
                    }}
                    className="px-[10px] py-[8px] hover:bg-gray-100 cursor-pointer text-lg font-bold"
                  >
                    {location}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[19px]">
          <div className="flex flex-col gap-[1px]">
            <div className="font-bold text-lg text-black">Salary range</div>
            <div className="text-lg text-black">
              Enter desired annual salary (e.g. 50000)
            </div>
          </div>
          <div className="flex flex-row gap-[25px]">
            <div className="flex flex-col w-[110px]">
              <div className="text-lg text-type-400 h-[30px]">Minimum</div>
              <TextInput
                onChange={handleMinChange}
                value={minInput.toString()}
                placeholder={DEFAULT_MIN_SALARY.toString()}
              />
            </div>
            <div className="flex flex-col w-[110px]">
              <div className="text-lg text-type-400 h-[30px]">Maximum</div>
              <TextInput
                onChange={handleMaxChange}
                value={maxInput.toString()}
                placeholder={DEFAULT_MAX_SALARY.toString()}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseSideModal>
  );
}
