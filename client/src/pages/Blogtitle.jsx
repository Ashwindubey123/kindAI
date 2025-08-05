 import React, { useState } from 'react';
import { Hash, Sparkles, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel'
  ];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;
      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        const cleaned = String(data.content || '')
          .trim()
          .replace(/^,/, '');

        setContent(cleaned);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
          <Sparkles className="w-6 h-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        {/* Keyword input */}
        <div>
          <p className="mt-6 text-sm font-medium">Keyword</p>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="The future of artificial intelligence is..."
            required
          />
        </div>

        {/* Blog category selection */}
        <div>
          <p className="mt-4 text-sm font-medium">Category</p>
          <div className="mt-3 flex gap-3 flex-wrap">
            {blogCategories.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedCategory(item)}
                className={`text-sm px-4 py-1 border rounded-full cursor-pointer transition 
                  ${selectedCategory === item
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'text-gray-500 border-gray-300 hover:bg-purple-100'
                  }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[336BFF] to-[#2269bb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <>
              <Edit className="w-5" />
              Generate title
            </>
          )}
        </button>
      </form>

      {/* Right column */}
      <div className="w-full md:w-1/2 max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200 min-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#779afd]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        {/* Markdown Output */}
     {typeof content === "string" && content.trim() !== '' ? (
  <div className="mt-3 h-full overflow-y-auto text-sm text-slate-600 prose prose-sm max-w-none">
    <Markdown>
      {String(content).replace(/^[,\s]+/, '')}
    </Markdown>
  </div>
) : (
  <div className="flex-1 flex justify-center items-center">
    <p className="text-gray-400">No article content to display.</p>
  </div>
)}

      </div>
    </div>
  );
};

export default BlogTitle;
