import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useFaqUpdateMutation,
  useGetFaqQuery,
} from "@/redux/features/adminApi";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Search, Bold, List, ListOrdered } from "lucide-react";
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
  const textareaRef = useRef(null);

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
    watch,
    formState: { errors },
  } = useForm();

  const answerValue = watch("answer");

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

  // Rich text formatting functions
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = answerValue || '';
    const selectedText = text.substring(start, end);

    let newText;
    let newCursorPos;

    if (selectedText) {
      // If text is selected, wrap it
      newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
      newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    } else {
      // If no selection, insert at cursor
      newText = text.substring(0, start) + prefix + suffix + text.substring(start);
      newCursorPos = start + prefix.length;
    }

    setValue("answer", newText);
    
    // Restore cursor position after React re-renders
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => {
    insertFormatting('**', '**');
  };

  const handleBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = answerValue || '';
    
    // Check if we're at the start or after a newline
    const needsNewline = start > 0 && text[start - 1] !== '\n';
    const prefix = needsNewline ? '\n• ' : '• ';
    
    insertFormatting(prefix, '');
  };

  const handleNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = answerValue || '';
    
    // Check if we're at the start or after a newline
    const needsNewline = start > 0 && text[start - 1] !== '\n';
    const prefix = needsNewline ? '\n1. ' : '1. ';
    
    insertFormatting(prefix, '');
  };

  // Format answer for display
  const formatAnswer = (answer) => {
    if (!answer) return '';
    
    return answer
      .split('\n')
      .map((line) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Bullet points
        if (line.trim().startsWith('•')) {
          return `<li class="ml-4">${line.trim().substring(1).trim()}</li>`;
        }
        
        // Numbered lists
        if (line.trim().match(/^\d+\./)) {
          const content = line.trim().replace(/^\d+\./, '').trim();
          return `<li class="ml-4">${content}</li>`;
        }
        
        return line;
      })
      .join('<br/>');
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
                    <div className="flex-1 mr-4">
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <div 
                        className="text-gray-300 text-sm prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatAnswer(faq.answer) }}
                      />
                    </div>

                    <div className="flex gap-3 items-start">
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
                    className="px-4 py-2 cursor-pointer bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded cursor-pointer ${
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
                    className="px-4 py-2 cursor-pointer bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute cursor-pointer top-3 right-3 text-gray-300 hover:text-white text-xl"
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
                    className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Write question..."
                  />
                  {errors.question && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.question.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Answer *</label>
                  
                  {/* Formatting Toolbar */}
                  <div className="flex gap-2 mb-2 p-2 bg-gray-800 rounded-t border border-b-0 border-gray-700">
                    <button
                      type="button"
                      onClick={handleBold}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                      title="Bold (wrap selected text with **)"
                    >
                      <Bold size={16} />
                      <span className="text-sm">Bold</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleBulletList}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                      title="Bullet List"
                    >
                      <List size={16} />
                      <span className="text-sm">Bullet</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleNumberedList}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                      title="Numbered List"
                    >
                      <ListOrdered size={16} />
                      <span className="text-sm">Number</span>
                    </button>

                    <div className="ml-auto text-xs text-gray-400 flex items-center">
                      Tip: Select text and click Bold, or use • for bullets
                    </div>
                  </div>

                  <textarea
                    {...register("answer", { required: "Answer is required" })}
                    ref={(e) => {
                      register("answer").ref(e);
                      textareaRef.current = e;
                    }}
                    rows={8}
                    className="w-full p-3 bg-gray-800 rounded-b border border-gray-700 focus:outline-none focus:border-blue-500 font-mono text-sm"
                    placeholder="Write answer... &#10;&#10;Use **text** for bold&#10;Use • for bullets&#10;Use 1. for numbered lists"
                  />
                  {errors.answer && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.answer.message}
                    </p>
                  )}

                  {/* Preview Section */}
                  {answerValue && (
                    <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">Preview:</p>
                      <div 
                        className="text-sm text-gray-200 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatAnswer(answerValue) }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="px-6 py-2 cursor-pointer bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit(onSubmit)}
                    type="button"
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer transition-colors"
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