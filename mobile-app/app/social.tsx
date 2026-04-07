import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "@/colors";
import Header from "@/components/Header";
import Title from "@/components/Title";
import SocialServicesCategories, {
  SocialService as CategoryService,
} from "@/components/SocialServicesCategories";
import { ResourceCard } from "@/components/FlipCard";
import { useState } from "react";
import { Ambulance, Apple, Bus, House } from "lucide-react-native";
import { trpc } from "@/lib/trpc";
import { SocialServiceCategory } from "@/types/api";
import JilaText from "@/components/JilaText";
import BottomBackground from "@/components/BottomBackground";
import { sizes } from "@/constants/sizes";
import { useTranslation } from 'react-i18next';


const CATEGORY_MAP: Record<
  Exclude<SocialServiceCategory, SocialServiceCategory.OTHER>,
  { icon: typeof Ambulance; name: string }
> = {
  [SocialServiceCategory.EMERGENCIA]: {
    icon: Ambulance,
    name: "Amank'wan ab'ix",
  },
  [SocialServiceCategory.SHELTERS]: {
    icon: House,
    name: "Wayub’",
  },
  [SocialServiceCategory.FOOD]: {
    icon: Apple,
    name: "Lob’ej",
  },
  [SocialServiceCategory.TRANSPORTATION]: {
    icon: Bus,
    name: "Iqb'al ek' anima",
  },
};

const DISPLAY_CATEGORIES = [
  SocialServiceCategory.EMERGENCIA,
  SocialServiceCategory.SHELTERS,
  SocialServiceCategory.FOOD,
  SocialServiceCategory.TRANSPORTATION,
];




export default function SocialServices() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { t } = useTranslation();

  const {
    data: socialServices,
    isLoading,
    error,
  } = trpc.socialServices.getAllSocialServices.useQuery();

  const categories: CategoryService[] = DISPLAY_CATEGORIES.map((category) => ({
    icon: CATEGORY_MAP[category].icon,
    name: CATEGORY_MAP[category].name,
  }));

  

  const currentCategory =
    currentCategoryIndex !== null
      ? DISPLAY_CATEGORIES[currentCategoryIndex]
      : null;

  const filteredServices =
    socialServices?.filter((service) => {
      const matchesCategory =
        currentCategory === null || service.category === currentCategory;

      const matchesSearch =
        !searchQuery ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        service.phone_number.includes(searchQuery) ||
        service.address?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }) || [];

  return (
    <>
      <Header
        toggleSearch={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <BottomBackground>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Title text= {t('SocialServicesPage.socServicesResources')} audioSource={null} />

          <SocialServicesCategories
            socialServices={categories}
            currentIndex={currentCategoryIndex}
            onSelect={setCurrentCategoryIndex}
          />

          {error ? (
            <View style={styles.errorContainer}>
              <JilaText style={styles.errorText}>
                Error loading services: {error.message}
              </JilaText>
              <JilaText style={styles.errorDetails}>
                Check console for details
              </JilaText>
            </View>
          ) : isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.jila[400]} />
              <JilaText style={styles.loadingText}>
                Loading social services...
              </JilaText>
            </View>
          ) : filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <JilaText style={styles.emptyText}>
                No services available in this category
              </JilaText>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {filteredServices.map((service) => (
                <ResourceCard
                  key={service.id}
                  title={service.title}
                  phone={service.phone_number}
                  addressLine={service.addressLine || undefined}
                  city={service.city || undefined}
                  state={service.state || undefined}
                  description={
                    service.description || "No description available"
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      </BottomBackground>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: sizes.spacing.lg,
    paddingTop: sizes.spacing.xl,
    paddingBottom: sizes.spacing.lg,
    gap: sizes.spacing.md,
  },
  categoriesContainer: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizes.spacing.xxl,
    gap: sizes.spacing.md,
  },
  loadingText: {
    fontSize: sizes.fontSize.sm,
    color: colors.gray[400],
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizes.spacing.xxl,
    paddingHorizontal: sizes.spacing.lg,
    gap: sizes.spacing.sm,
  },
  errorText: {
    fontSize: sizes.fontSize.md,
    color: colors.error[400],
    textAlign: "center",
    fontWeight: "600",
  },
  errorDetails: {
    fontSize: sizes.fontSize.xs,
    color: colors.gray[400],
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizes.spacing.xxl,
  },
  emptyText: {
    fontSize: sizes.fontSize.md,
    color: colors.gray[400],
    textAlign: "center",
  },
  cardsContainer: {
    gap: sizes.spacing.md,
  },
});
