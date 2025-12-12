import { Search } from "lucide-react";
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
}) {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-zinc-400 text-sm">{subtitle}</p>}
      </div>

      {/* Search / Filters */}
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <div className="flex flex-col md:flex-row gap-4">

          {/* SEARCH */}
          <div className="flex-1 relative">
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
            <Select value={statusFilter} onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[150px]  text-white">
                <SelectValue placeholder="Filter" className="text-white" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Items Per Page */}
          <Select value={itemsPerPage.toString()} onValueChange={(v) => {
            setItemsPerPage(Number(v));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[120px] text-white border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((num) => (
                <SelectItem value={num.toString()} key={num} className="">
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
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-zinc-400">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row._id}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-white">
                      {col.render ? col.render(row) : row[col.key]}
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
