import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useFaqUpdateMutation,
  useGetFaqQuery,
} from "@/redux/features/adminApi";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { toast } from "sonner";

const AdminFaq = () => {
  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useFaqUpdateMutation();
  const { data, isLoading: faqLoading, refetch } = useGetFaqQuery();
  const [deleteFaq, {data: deleteData}] = useDeleteFaqMutation()

  const [faqList, setFaqList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (data?.data) {
      setFaqList(data.data.map((faq) => ({ ...faq })));
    }
  }, [data]);

  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!showModal) {
      setEditingFaq(null);
      reset();
    }
  }, [showModal, reset]);

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqList;
    
    const query = searchQuery.toLowerCase();
    return faqList.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [faqList, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setValue("question", faq.question);
    setValue("answer", faq.answer);
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingFaq) {
        const res = await updateFaq({
          id: editingFaq._id,
          ...formData,
        }).unwrap();

        setFaqList((prev) =>
          prev.map((faq) => (faq._id === editingFaq._id ? res.data : faq))
        );
      } else {
        const res = await createFaq(formData).unwrap();
        setFaqList((prev) => [res.data, ...prev]);
      }

      setShowModal(false);
      reset();
    } catch (error) {
      console.log("FAQ Error:", error);
    }
  };

  const handleDelete = async(id) => {
    const response  = await deleteFaq({id}).unwrap()

    console.log(response)

    if(response.status) {
      toast.success("Faq Deleted")
     
    }

    
  };

  if (faqLoading) return <h1 className="text-white p-6">Loading...</h1>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            + Add FAQ
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question or answer..."
            className="w-full pl-10 pr-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* FAQ LIST */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All FAQs</h2>
            <p className="text-gray-400 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredFaqs.length)} of {filteredFaqs.length}
            </p>
          </div>

          {filteredFaqs.length === 0 ? (
            <p className="text-gray-400">
              {searchQuery ? "No FAQs match your search." : "No FAQs found."}
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedFaqs.map((faq) => (
                  <div
                    key={faq._id}
                    className="border-b border-gray-800 pb-4 flex justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{faq.question}</h3>
                      <p className="text-gray-300 text-sm">{faq.answer}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="px-4 py-1 bg-yellow-500 cursor-pointer text-black rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="px-4 py-1 bg-red-600 rounded cursor-pointer hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded ${
                          currentPage === page
                            ? "bg-blue-600"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {editingFaq ? "Edit FAQ" : "Add FAQ"}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block mb-2">Question *</label>
                  <input
                    {...register("question", {
                      required: "Question is required",
                    })}
                    className="w-full p-3 bg-gray-800 rounded border border-gray-700"
                    placeholder="Write question..."
                  />
                  {errors.question && (
                    <p className="text-red-400 text-sm">
                      {errors.question.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Answer *</label>
                  <textarea
                    {...register("answer", { required: "Answer is required" })}
                    rows={4}
                    className="w-full p-3 bg-gray-800 rounded border border-gray-700"
                    placeholder="Write answer..."
                  />
                  {errors.answer && (
                    <p className="text-red-400 text-sm">
                      {errors.answer.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit(onSubmit)}
                    type="button"
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
                  >
                    {editingFaq ? "Update FAQ" : "Add FAQ"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFaq;