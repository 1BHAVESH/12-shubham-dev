import { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useGetPrivacyPolicyQuery } from "@/redux/features/shubamdevApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";


const PolicyEditor = ({ placeholder }) => {
  const { data, isLoading } = useGetPrivacyPolicyQuery();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.data?.content) {
      setContent(data.data.content);
    }
  }, [data]);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 400,
      placeholder: placeholder || "Start typing...",
      
      // ✅ Enable multiple file selection
      uploader: {
        insertImageAsBase64URI: true, // Store as base64 (or set to false for server upload)
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        filesVariableName: "files", // Allows multiple files
        withCredentials: false,
        
        // Optional: Custom upload to your server
        // url: "http://localhost:3001/api/upload-images",
        // method: "POST",
        // headers: {
        //   "Authorization": "Bearer YOUR_TOKEN"
        // },
        
        // Process server response
        // process: function (resp) {
        //   return {
        //     files: resp.data.files || [],
        //     path: "",
        //     baseurl: "",
        //     error: resp.error ? 1 : 0,
        //     msg: resp.message
        //   };
        // },
        
        defaultHandlerSuccess: function (data, resp) {
          const files = data.files || [];
          files.forEach((file, index) => {
            this.s.insertImage(file);
          });
        },
        
        error: function (e) {
          this.j.alert("Upload error: " + e.message);
        }
      },
      
      // ✅ Image editing options
      image: {
        openOnDblClick: true,
        editSrc: true,
        editTitle: true,
        editAlt: true,
        editLink: true,
        editSize: true,
        editBorderRadius: true,
        editMargins: true,
        editStyle: true,
        useImageEditor: true,
        selectImageAfterClose: true,
      },
      
      // ✅ Enable drag & drop for multiple images
      enableDragAndDropFileToEditor: true,
      
      // ✅ Toolbar with image options
      buttons: [
        "source", "|",
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|",
        "outdent", "indent", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "image", "video", "file", "table", "link", "|",
        "align", "undo", "redo", "|",
        "hr", "eraser", "copyformat", "|",
        "symbol", "fullsize", "print"
      ],
      
      // ✅ After image insert - apply default styling
      events: {
        afterInsertImage: function (img) {
          img.style.maxWidth = "100%";
          img.style.height = "auto";
          img.style.margin = "10px";
          img.style.borderRadius = "4px";
          
          // Add class for easier styling
          img.classList.add("editor-image");
        },
        
        // Handle paste events for images
        paste: function (e) {
          if (e.clipboardData && e.clipboardData.files.length > 0) {
            const files = Array.from(e.clipboardData.files);
            files.forEach(file => {
              if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  this.s.insertImage(event.target.result);
                };
                reader.readAsDataURL(file);
              }
            });
            e.preventDefault();
          }
        }
      },
      
      // ✅ Style for images in editor
      style: {
        ".jodit-wysiwyg img": {
          maxWidth: "100%",
          height: "auto",
          cursor: "pointer"
        }
      }
    }),
    [placeholder]
  );

  const savePolicy = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/privacy-policy`, {
        content,
      });

      alert("Privacy Policy Saved Successfully!");

    } catch (error) {
      console.error(error);
      alert("Failed to save policy");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <h1>Loading editor...</h1>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Privacy Policy Editor</h2>
      
      <div className="mb-3 p-3 bg-blue-50 rounded text-sm">
        <strong>💡 Image Upload Options:</strong>
        <ul className="list-disc ml-5 mt-2">
          <li>Click the <strong>Image button</strong> in toolbar</li>
          <li><strong>Drag & drop</strong> multiple images directly into editor</li>
          <li><strong>Copy & paste</strong> images from clipboard</li>
          <li>Double-click any image to edit properties</li>
        </ul>
      </div>

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onChange={(newContent) => setContent(newContent)}
      />

      <button
        onClick={savePolicy}
        className="mt-4 px-6 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Policy"}
      </button>
    </div>
  );
};

export default PolicyEditor;