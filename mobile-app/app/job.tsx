import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useRef } from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import JobBottomDrawer from "@/components/JobBottomDrawer";
import Text from "@/components/JilaText";
import AudioButton, { AudioButtonHandle } from "@/components/AudioButton";
import { SlidersHorizontal } from "lucide-react-native";
import { FilterDropdownMultiselect } from "@/components/FilterDropdownMultiselect";
import { FilterDropdownSearch } from "@/components/FilterDropdownSearch";
import { TTSItem } from "@/controllers/TTSController";
import { BaseBottomSheet } from "@/components/BaseBottomSheet";
import { Button } from "@/components/Button";
import { trpc } from "@/lib/trpc";
import { Job as BackendJob } from "@/types/api";

const sampleAudio = require("../assets/audio/short_sample.mp3");

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  applyUrl: string;
  workLocation: string;
  jobType: string;
  jobDescription: string;
};

const JOB_TYPE_OPTIONS: TTSItem[] = [
  { id: "internship", text: "Internship", audioSource: sampleAudio },
  { id: "temporary", text: "Temporary", audioSource: sampleAudio },
  { id: "full-time", text: "Full-time", audioSource: sampleAudio },
  { id: "freelance", text: "Freelance", audioSource: sampleAudio },
  { id: "part-time", text: "Part-time", audioSource: sampleAudio },
  { id: "seasonal", text: "Seasonal", audioSource: sampleAudio },
  { id: "contract", text: "Contract", audioSource: sampleAudio },
];

const LANGUAGE_OPTIONS: TTSItem[] = [
  { id: "spanish", text: "Spanish", audioSource: sampleAudio },
  { id: "qanjobal", text: "Q'anjob'al", audioSource: sampleAudio },
  { id: "non-english", text: "Non-English", audioSource: sampleAudio },
];

export default function JobBoard() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [jobTypeSelected, setJobTypeSelected] = useState(new Set<string>());
  const [languageSelected, setLanguageSelected] = useState(new Set<string>());
  const [location, setLocation] = useState("");

  const {
    data: jobs,
    isLoading,
    error,
  } = (trpc as any).jobs.getAllJobs.useQuery();

  const audioButtonRef = useRef<AudioButtonHandle>(null);
  const jobBoardTitleAudio = sampleAudio;

  const jobTypeTitle: TTSItem = {
    id: "job-title-1",
    text: "Job Type",
    audioSource: sampleAudio,
  };

  const languageTitle: TTSItem = {
    id: "language-title-1",
    text: "Language",
    audioSource: sampleAudio,
  };

  const locationTitle: TTSItem = {
    id: "location-title-1",
    text: "Location",
    audioSource: sampleAudio,
  };

  const mappedJobs: Job[] =
    jobs?.map((job: BackendJob) => ({
      id: job.id.toString(),
      title: job.titleEnglish,
      company: job.companyName,
      location: `${job.city}, ${job.state}`,
      salary: `$${job.salary}`, // Basic formatting
      applyUrl: job.url || "",
      workLocation: job.locationType,
      jobType: job.jobType,
      jobDescription: job.descriptionEnglish || "",
    })) || [];

  // Filter jobs based on search and filters
  const filteredJobs = mappedJobs.filter((job) => {
    const matchesSearch =
      searchValue === "" ||
      job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      job.company.toLowerCase().includes(searchValue.toLowerCase());

    const matchesJobType =
      jobTypeSelected.size === 0 ||
      jobTypeSelected.has(job.jobType.toLowerCase().replace("-", " "));

    const matchesLocation =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesJobType && matchesLocation;
  });

  const handleClearFilters = () => {
    setJobTypeSelected(new Set());
    setLanguageSelected(new Set());
    setLocation("");
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.jila[400]} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Error loading jobs.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        toggleSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <View style={styles.content}>
        {/* Title with audio button */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Job Board</Text>
          <AudioButton audioSource={jobBoardTitleAudio} ref={audioButtonRef} />
        </View>

        {/* Filter button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={16} color={colors.gray[300]} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        {/* Job cards list or empty state */}
        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No jobs found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JobCard
                title={item.title}
                company={item.company}
                location={item.location}
                salary={item.salary}
                onPress={() => setSelectedJob(item)}
              />
            )}
            contentContainerStyle={styles.jobList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Job details bottom drawer */}
      {selectedJob && (
        <JobBottomDrawer
          applyUrl={selectedJob.applyUrl}
          company={selectedJob.company}
          role={selectedJob.title}
          companyLocation={selectedJob.location}
          salary={selectedJob.salary}
          workLocation={selectedJob.workLocation}
          jobType={selectedJob.jobType}
          jobDescription={selectedJob.jobDescription}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Filter modal */}
      {showFilters && (
        <BaseBottomSheet
          height="65%"
          maxHeight={sizes.screen.height * 0.65}
          onClose={() => setShowFilters(false)}
        >
          <View style={styles.filterContent}>
            <FilterDropdownMultiselect
              title={jobTypeTitle}
              options={JOB_TYPE_OPTIONS}
              selected={jobTypeSelected}
              onSelectedChange={setJobTypeSelected}
            />

            <FilterDropdownMultiselect
              title={languageTitle}
              options={LANGUAGE_OPTIONS}
              selected={languageSelected}
              onSelectedChange={setLanguageSelected}
            />

            <FilterDropdownSearch
              title={locationTitle}
              value={location}
              onChange={setLocation}
              isFocused={false}
            />

            {/* Apply and Clear buttons */}
            <View style={styles.filterActions}>
              <View style={{ flex: 1 }}>
                <Button
                  text="Clear all"
                  onPress={handleClearFilters}
                  preset="outline"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  text={`Apply (${filteredJobs.length})`}
                  onPress={handleApplyFilters}
                  preset="secondary"
                  customStyle={{
                    paddingHorizontal: sizes.spacing.sm,
                    fontSize: sizes.fontSize.sm,
                  }}
                />
              </View>
            </View>
          </View>
        </BaseBottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream[300],
  },
  content: {
    flex: 1,
    paddingHorizontal: sizes.spacing.lg,
    paddingTop: sizes.spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.spacing.sm,
    marginBottom: sizes.spacing.md,
  },
  title: {
    fontSize: sizes.fontSize.xl,
    fontWeight: "600",
    color: colors.type[400],
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: colors.gray[300],
    borderRadius: 10,
    backgroundColor: colors.white[400],
    alignSelf: "flex-start",
    marginBottom: sizes.spacing.md,
  },
  filterText: {
    fontSize: sizes.fontSize.base,
    fontWeight: "700",
    color: colors.gray[300],
  },
  jobList: {
    gap: 12,
    paddingBottom: sizes.spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingTop: sizes.spacing.xxl,
  },
  emptyText: {
    fontSize: sizes.fontSize.base,
    color: colors.type[400],
  },
  filterContent: {
    gap: 0,
  },
  filterActions: {
    flexDirection: "row",
    gap: sizes.spacing.lg,
    paddingHorizontal: sizes.spacing.lg,
    paddingTop: sizes.spacing.lg,
  },
  filterActionButton: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
