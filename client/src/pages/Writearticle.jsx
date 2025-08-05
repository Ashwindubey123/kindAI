 import React, { useState } from 'react';
import { Edit, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const articleLengthOptions = [
  { text: 'Short (300 words)' },
  { text: 'Medium (600 words)' },
  { text: 'Long (1000+ words)' },
];

const WriteArticle = () => {
  const [topic, setTopic] = useState('');
  const [selectedLength, setSelectedLength] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!topic || !selectedLength) {
      toast.error('Please enter a topic and select a length.');
      return;
    }

    try {
      setLoading(true);

      const prompt = `Write an article about ${topic} in ${selectedLength.text}`;
      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-article',
        {
          prompt,
          length: selectedLength.text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || 'Failed to generate article.');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col md:flex-row gap-6 text-slate-700">
      {/* Left Column - Configuration */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:w-1/2 bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>

        {/* Topic Input */}
        <div>
          <p className="mt-6 text-sm font-medium">Article Topic</p>
          <input
            onChange={(e) => setTopic(e.target.value)}
            value={topic}
            type="text"
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="The future of artificial intelligence is..."
            required
          />
        </div>

        {/* Article Length */}
        <div>
          <p className="mt-4 text-sm font-medium">Article Length</p>
          <div className="mt-3 flex gap-3 flex-wrap">
            {articleLengthOptions.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedLength(item)}
                className={`text-sm px-4 py-1 border rounded-full cursor-pointer transition 
                  ${
                    selectedLength?.text === item.text
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'text-gray-500 border-gray-300 hover:bg-blue-50'
                  }`}
              >
                {item.text}
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
              Generate Article
            </>
          )}
        </button>
      </form>

      {/* Right Column - Output */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem] max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        {typeof content === "string" && content.trim().length > 0 ? (
  <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600 whitespace-pre-line">
    <div className="reset-tw">
      <Markdown>{content}</Markdown>
    </div>
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

export default WriteArticle;
