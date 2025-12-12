import { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useGetPrivacyPolicyQuery } from "@/redux/features/shubamdevApi";

const PolicyEditor = ({ placeholder }) => {
  const { data, isLoading } = useGetPrivacyPolicyQuery();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.data?.content) {
      setContent(data.data.content);   // ⭐ Editor me existing content show hoga
    }
  }, [data]);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 400,
      placeholder: placeholder || "Start typing...",
      events: {
        afterInsertImage: function (img) {
          img.style.width = "300px";
          img.style.height = "auto";
        },
      },
    }),
    [placeholder]
  );

  const savePolicy = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3001/api/privacy-policy", {
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

  if (isLoading) return <h1>wait...</h1>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Privacy Policy Editor</h2>

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onChange={(newContent) => setContent(newContent)}  // ⭐ Proper update
      />

      <button
        onClick={savePolicy}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Policy"}
      </button>
    </div>
  );
};

export default PolicyEditor;
