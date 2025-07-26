// Components/ProjectCreation/IndustrySelectionStep.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProjectCreationHeader from "./ProjectCreationHeader";

export default function IndustrySelectionStep({
  industries,
  selectedIndustryId,
  onIndustrySelect,
  onBack,
  customIndustryName = "", // Add this prop to receive the custom industry name
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [customIndustry, setCustomIndustry] = useState(
    customIndustryName || ""
  );
  const [isOtherSelected, setIsOtherSelected] = useState(
    selectedIndustryId === "other" || selectedIndustryId === "other-temp"
  );

  // Filter industries based on search term
  const filteredIndustries = industries.filter(
    (industry) =>
      industry.industry_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (industry.industry_description &&
        industry.industry_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // Find the "Other" industry option - debug this
  const otherIndustry = industries.find(
    (industry) => industry.industry_name.toLowerCase().trim() === "other"
  );

  // Handle industry selection
  const handleIndustryClick = (industry) => {
    if (
      industry.industry_name.toLowerCase() === "other" ||
      industry.id === "other-temp"
    ) {
      setIsOtherSelected(true);
      // Don't proceed to next step yet - wait for custom industry input
    } else {
      onIndustrySelect(industry.id);
    }
  };

  // Handle custom industry submission
  const handleCustomIndustrySubmit = () => {
    if (customIndustry.trim()) {
      // Pass both the "other" ID and the custom industry name
      onIndustrySelect("other", customIndustry.trim());
    }
  };

  // Show only first 4 industries when no search term
  // ALWAYS ensure the selected industry is visible when going back
  let displayedIndustries;
  if (searchTerm.trim() === "") {
    // Get first 4 industries
    let baseIndustries = industries.slice(0, 4);

    // Check if ANY industry is selected and needs to be shown
    if (selectedIndustryId) {
      let selectedIndustry = null;

      // Handle "Other" selection
      if (
        selectedIndustryId === "other" ||
        selectedIndustryId === "other-temp"
      ) {
        selectedIndustry = industries.find(
          (ind) => ind.industry_name.toLowerCase() === "other"
        ) || {
          id: "other-temp",
          industry_name: "Other",
          industry_description:
            "Industries not listed above - please specify your industry type",
        };
      } else {
        // Handle regular industry selection
        selectedIndustry = industries.find(
          (ind) => ind.id === selectedIndustryId
        );
      }

      // If selected industry is not in the first 4, replace the 4th with selected industry
      if (
        selectedIndustry &&
        !baseIndustries.some(
          (ind) =>
            ind.id === selectedIndustryId ||
            (selectedIndustryId === "other" &&
              ind.industry_name.toLowerCase() === "other") ||
            (selectedIndustryId === "other-temp" &&
              (ind.industry_name.toLowerCase() === "other" ||
                ind.id === "other-temp"))
        )
      ) {
        baseIndustries = baseIndustries.slice(0, 3);
        baseIndustries.push(selectedIndustry);
      }
    }

    displayedIndustries = baseIndustries;
  } else if (filteredIndustries.length === 0) {
    // Always show Other when no results, even if not found in database
    if (otherIndustry) {
      displayedIndustries = [otherIndustry];
    } else {
      // Create a temporary "Other" option if not in database
      displayedIndustries = [
        {
          id: "other-temp",
          industry_name: "Other",
          industry_description:
            "Industries not listed above - please specify your industry type",
        },
      ];
    }
  } else {
    displayedIndustries = filteredIndustries;
  }

  return (
    <motion.div
      key="industry"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="px-2 sm:px-3 lg:px-0" // Responsive padding
    >
      <ProjectCreationHeader
        showBackButton={true}
        onBack={onBack}
        title={t("select_industry")}
      />

      {/* Search Bar */}
      <div className="w-full max-w-4xl mx-auto mb-3 sm:mb-4 md:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-8 sm:pl-9 md:pl-10 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-[#111214] text-gray-900 dark:text-gray-200 text-sm sm:text-base
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Info note when no search term */}
        {searchTerm.trim() === "" && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2 px-2">
            Showing 4 popular industries. Use the search above to find more
            options.
          </p>
        )}

        {/* No results message - now shows "Other" option */}
        {searchTerm.trim() !== "" && filteredIndustries.length === 0 && (
          <div className="text-center mt-2 px-2">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
              No industries found matching "{searchTerm}".
            </p>
            {otherIndustry && (
              <p className="text-xs sm:text-sm text-blue-500 dark:text-blue-400">
                Don't worry! You can select "Other" below to specify your
                industry.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-4xl mx-auto">
        {displayedIndustries.map((industry) => {
          // COMPREHENSIVE selection check for ANY industry type
          const isSelected =
            // Direct ID match
            selectedIndustryId === industry.id ||
            // Handle "Other" selections - multiple ways it can be selected
            (selectedIndustryId === "other" &&
              (industry.industry_name.toLowerCase() === "other" ||
                industry.id === "other-temp")) ||
            (selectedIndustryId === "other-temp" &&
              (industry.industry_name.toLowerCase() === "other" ||
                industry.id === "other-temp")) ||
            // Handle numeric selectedIndustryId matching industry.id
            (typeof selectedIndustryId === "number" &&
              industry.id === selectedIndustryId) ||
            (typeof selectedIndustryId === "string" &&
              parseInt(selectedIndustryId) === industry.id);

          const isOtherCard =
            industry.industry_name.toLowerCase() === "other" ||
            industry.id === "other-temp";
          const showInput = isOtherCard && (isOtherSelected || isSelected);

          console.log(
            "Industry:",
            industry.industry_name,
            "Selected ID:",
            selectedIndustryId,
            "Industry ID:",
            industry.id,
            "Is Selected:",
            isSelected
          );

          return (
            <motion.div
              key={industry.id}
              onClick={() => handleIndustryClick(industry)}
              className={`p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg cursor-pointer text-center transition-all duration-300 
                                        min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex items-center touch-manipulation
                                ${
                                  isSelected
                                    ? "Fdbg text-white"
                                    : isOtherCard
                                    ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-dashed border-purple-300 dark:border-purple-600 dark:text-gray-200"
                                    : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                                }
                                hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white `}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center w-full">
                {/* Show input field when Other is selected or being edited */}
                {showInput ? (
                  <div className="w-full" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Enter your industry..."
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && customIndustry.trim()) {
                          handleCustomIndustrySubmit();
                        }
                      }}
                      className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm rounded-lg border-0 
                                                     bg-white/10 backdrop-blur-sm text-white placeholder-gray-300
                                                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20
                                                     transition-all duration-200"
                      autoFocus={!isSelected}
                    />
                    <div className="flex gap-2 mt-2 sm:mt-3">
                      <button
                        onClick={handleCustomIndustrySubmit}
                        disabled={!customIndustry.trim()}
                        className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-lg 
                                                         min-h-[32px] sm:min-h-[36px] md:min-h-[44px] touch-manipulation
                                                         bg-gradient-to-r from-blue-500 to-indigo-600 
                                                         hover:from-blue-600 hover:to-indigo-700 
                                                         focus:outline-none focus:ring-2 focus:ring-white/30
                                                         disabled:opacity-50 disabled:cursor-not-allowed
                                                         transition-all duration-200 shadow-lg"
                      >
                        {isSelected ? "Update" : "Confirm"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOtherSelected(false);
                          if (!isSelected) {
                            setCustomIndustry("");
                          }
                        }}
                        className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-300 rounded-lg 
                                                         min-h-[32px] sm:min-h-[36px] md:min-h-[44px] touch-manipulation
                                                         bg-white/10 hover:bg-white/20 border border-white/20
                                                         focus:outline-none focus:ring-2 focus:ring-white/30
                                                         transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Show icon only when not in input mode */}
                    {isOtherCard && (
                      <div className="mb-1 sm:mb-2 md:mb-3">
                        <svg
                          className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-500 dark:text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Show title and custom industry badge when not in input mode */}
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 leading-tight">
                      {industry.industry_name}
                      {isSelected && customIndustry && (
                        <span
                          className="block text-xs sm:text-sm font-normal text-blue-100 mt-1 sm:mt-2 px-2 sm:px-3 py-0.5 sm:py-1 
                                                               bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
                        >
                          {customIndustry}
                        </span>
                      )}
                    </h3>

                    {/* Show description and call-to-action when not in input mode */}
                    {industry.industry_description && !isOtherCard && (
                      <p className="text-xs sm:text-sm leading-snug line-clamp-2 px-1">
                        {industry.industry_description}
                      </p>
                    )}
                    {industry.industry_description &&
                      isOtherCard &&
                      !isSelected && (
                        <p className="text-xs sm:text-sm leading-snug px-1">
                          {industry.industry_description}
                        </p>
                      )}
                    {isOtherCard && !isSelected && (
                      <p className="text-xs text-purple-300 mt-1 sm:mt-2 md:mt-3 font-medium flex items-center justify-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Tap to specify
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
