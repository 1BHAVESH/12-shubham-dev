import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function DataTable({
  title,
  subtitle,
  data,
  paginatedData,
  filteredData,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  filterOptions = [],
  columns = [],
  sortConfig,
  setSortConfig,
  onToggleStatus, // New prop for handling status toggle with validation
}) {
  // Validate and handle status toggle
  const handleToggleStatus = (row) => {
    // Count active items
    const activeCount = data.filter(item => item.status === 'active' || item.isActive === true).length;
    
    // If trying to deactivate the last active item, prevent it
    const isCurrentlyActive = row.status === 'active' || row.isActive === true;
    if (isCurrentlyActive && activeCount === 1) {
      alert('At least one item must remain active');
      return;
    }
    
    // Call the parent handler if provided
    if (onToggleStatus) {
      onToggleStatus(row);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    if (!setSortConfig) {
      console.warn("setSortConfig prop is not provided to DataTable");
      return;
    }
    
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get the appropriate sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 ml-2 inline-block opacity-50" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="w-4 h-4 ml-2 inline-block text-[#d4af37]" />;
    }
    return <ArrowDown className="w-4 h-4 ml-2 inline-block text-[#d4af37]" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || subtitle) && (
        <div>
          {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
          {subtitle && <p className="text-zinc-400 text-sm">{subtitle}</p>}
        </div>
      )}

      {/* Search / Filters */}
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 md:max-w-[500px]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* SEARCH */}
          <div className="w-[250px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Filters */}
          {filterOptions.length > 0 && (
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] cursor-pointer text-white">
                <SelectValue placeholder="Filter" className="text-white" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Items Per Page */}
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px] cursor-pointer text-white border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((num) => (
                <SelectItem
                  value={num.toString()}
                  key={num}
                  className="cursor-pointer"
                >
                  {num} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter result count */}
        {(searchQuery || statusFilter !== "all") && (
          <p className="text-sm text-zinc-400 mt-2">
            Showing {filteredData.length} of {data.length} results
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className="text-zinc-400">
                  {col.sortable !== false ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center hover:text-white transition-colors cursor-pointer font-medium"
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-zinc-400"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row._id}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-white">
                      {col.render ? col.render(row, handleToggleStatus) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-zinc-800 p-4 flex justify-between items-center">
            <p className="text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}