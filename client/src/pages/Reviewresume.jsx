 import React, { useState } from 'react';
import { Edit, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import Markdown from 'react-markdown'; // ✅ Make sure this package is installed

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Reviewresume = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error('Please upload a PDF resume');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post(
        '/api/ai/resume-review',
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content); // Assume markdown or plain text
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col md:flex-row items-start gap-6 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:w-1/2 bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        <div>
          <p className="mt-6 text-sm font-medium">Upload Resume (PDF only)</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setInput(e.target.files[0])}
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Supporting PDF format only</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#336BFF] to-[#2269bb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <>
              <Edit className="w-5" />
              Review Resume
            </>
          )}
        </button>
      </form>

      {/* Right column */}
      <div className="w-full md:w-1/2 max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200 min-h-96 flex flex-col">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#779afd]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
              <FileText className="w-9 h-9" />
              <p>
                Upload a resume and click <strong>"Review Resume"</strong> to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw prose">
 console.log("Creation Content:", item.content); 
<Markdown>{item.content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviewresume;
