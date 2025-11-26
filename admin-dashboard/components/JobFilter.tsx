import RadioButtonGroup from "./RadioButtonGroup";
import { useState, useMemo } from "react";
import { TextInput } from "./Input";
import SearchBar from "./SearchBar";
import { trpc } from "@/lib/trpc";

export default function JobFilter ({}) {

    const speakerOptions = [
        { name: "Non-English" },
        { name: "Spanish"},
        { name: "Q'anjob'al" },
    ];
    const [selectedSpeakerOptions, setSelectedSpeakerOptions] = useState([""]);

    const locationOptions = [
        { name: "Remote" },
        { name: "Hybrid"},
        { name: "In person" },
    ];
    const [selectedLocationOptions, setSelectedLocationOptions] = useState([""]);

    const jobTypeOptions = [
        { name: "Internship" },
        { name: "Full-time"},
        { name: "Q'anjob'al" },
        { name: "Part-time" },
        { name: "Temporary" },
        { name: "Freelance" },
        { name: "Seasonal" },
    ];
    const [selectedJobTypeOptions, setSelectedJobTypeOptions] = useState([""]);

    const [minInput, setMinInput] = useState(10000);
    const [maxInput, setMaxInput] = useState(100000);

    const handleMaxChange = (stringValue: string) => {
        const numberValue = parseInt(stringValue);

        if (isNaN(numberValue)) {
            setMaxInput(100000);
        } else {
            setMaxInput(numberValue);
        }
    };

    const handleMinChange = (stringValue: string) => {
        const numberValue = parseInt(stringValue);

        if (isNaN(numberValue)) {
            setMinInput(10000);
        } else {
            setMinInput(numberValue);
        }
    };

    const [searchQuery, setSearchQuery] = useState("");

    const { data: allJobs } = trpc.jobs.getAllJobs.useQuery();

    const filteredJobCount = useMemo(() => {
        if (!allJobs) return 0;

        return allJobs.filter((job: { locationType: string; jobType: string; salary: number; city: string; state: string; }) => {
            if (selectedLocationOptions.length > 0 && selectedLocationOptions[0] !== "") {
                const locationMatch = selectedLocationOptions.some(loc => {
                    if (loc === "Remote") return job.locationType === "REMOTE";
                    if (loc === "Hybrid") return job.locationType === "HYBRID";
                    if (loc === "In person") return job.locationType === "IN-PERSON";
                    return false;
                });
                if (!locationMatch) return false;
            }

            if (selectedJobTypeOptions.length > 0 && selectedJobTypeOptions[0] !== "") {
                const jobTypeMatch = selectedJobTypeOptions.some(type => {
                    const typeUpper = type.toUpperCase().replace(/-/g, "-");
                    return job.jobType === typeUpper;
                });
                if (!jobTypeMatch) return false;
            }

            if (job.salary < minInput || job.salary > maxInput) {
                return false;
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const cityMatch = job.city.toLowerCase().includes(query);
                const stateMatch = job.state.toLowerCase().includes(query);
                if (!cityMatch && !stateMatch) return false;
            }

            return true;
        }).length;
    }, [allJobs, selectedLocationOptions, selectedJobTypeOptions, minInput, maxInput, searchQuery]);

    return (
        <div className="h-[full] w-[47.55%] rounded-l-[15px] pr-[25px] pl-[25px] pt-[25px] flex flex-col gap-[14px] relative">
            <div className="border-b-[1px] border-b-gray-200 flex flex-col gap-[16px]">

                <div className="text-bold">Speaker tags</div>
                
                <div className="pb-[30px]">
                    <RadioButtonGroup
                        options={speakerOptions}
                        selectedOptions={selectedSpeakerOptions}
                        setSelectedOptions={setSelectedSpeakerOptions}
                    />
                </div>

            </div>

            <div className="border-b-[1px] border-b-gray-200 flex flex-col gap-[16px]">

                <div className="text-bold">Location type</div>

                <div className="pb-[30px]">
                    <RadioButtonGroup
                        options={locationOptions}
                        selectedOptions={selectedLocationOptions}
                        setSelectedOptions={setSelectedLocationOptions}
                    />
                </div>
            </div>

            <div className="border-b-[1px] border-b-gray-200 flex flex-col gap-[16px]">

                <div className="text-bold">Job type</div>
                
                <div className="pb-[30px]">
                    <RadioButtonGroup
                        options={jobTypeOptions}
                        selectedOptions={selectedJobTypeOptions}
                        setSelectedOptions={setSelectedJobTypeOptions}
                    />
                </div>

            </div>

            <div>
            <div>Location</div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by city, state, or zip code"/>

            </div>

            <div className="flex flex-col">
                <div className="text-bold mb-[1px]">Salary range</div>
                <div>Enter desired annual salary (e.g. 50000)</div>

                <div className="flex flex-row gap-[25px]">
                    <div className="flex flex-col">
                        <div>Minimum</div>
                        <TextInput onChange={handleMinChange} value={minInput.toString()} placeholder={"10000"}/>
                    </div>
                    <div className="flex flex-col">
                        <div>Maximum</div>
                        <TextInput onChange={handleMaxChange} value={maxInput.toString()} placeholder={"100000"}/>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 w-full h-[100px] bg-white border-t border-gray-200 flex items-center justify-between px-[25px] -mx-[25px]">
                <div className="text-gray-600">
                    {filteredJobCount} results
                </div>
                
                <div className="flex gap-[16px]">
                    <button
                        onClick={() => {
                            setSelectedSpeakerOptions([""]);
                            setSelectedLocationOptions([""]);
                            setSelectedJobTypeOptions([""]);
                            setMinInput(10000);
                            setMaxInput(100000);
                            setSearchQuery("");
                        }}
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Clear all
                    </button>
                    
                    <button
                        onClick={() => {}}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-[32px] py-[12px] rounded-[8px]"
                    >
                        Apply
                    </button>
                </div>
            </div>

        </div>
    );
}