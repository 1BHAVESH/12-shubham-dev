import { useState, useMemo } from "react";

export default function useDataTable(data, options = {}) {
  const {
    searchKeys = [],          // kin fields me search karna hai
    filterFunction = null,    // custom filter logic
    defaultItemsPerPage = 10, // default pagination number
  } = options;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // SEARCH + FILTER
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search Logic
      const matchesSearch =
        searchKeys.some((key) =>
          item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Filter Logic (optional)
      const matchesFilter = filterFunction
        ? filterFunction(item, statusFilter)
        : true;

      return matchesSearch && matchesFilter;
    });
  }, [data, searchQuery, statusFilter]);

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return {
    searchQuery,
    setSearchQuery,
    
    statusFilter,
    setStatusFilter,

    currentPage,
    setCurrentPage,

    itemsPerPage,
    setItemsPerPage,

    totalPages,
    filteredData,
    paginatedData,
  };
}
