 import React, { useState } from 'react';
import { Sparkles, Edit, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const Generateimg = () => {
  const imageStyle = ['Realistic', 'Ghibli', 'Anime', '3D', 'Lifestyle'];
  const [selectStyle, setselectStyle] = useState('realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const prompt = `GENERATE an image of ${input} in the style ${selectStyle}`;
      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content); // should be image URL or base64
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false); // ✅ Fixed
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col md:flex-row items-start gap-6 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:w-1/2 bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI image Generator</h1>
        </div>

        {/* Input */}
        <div>
          <p className="mt-6 text-sm font-medium">Describe your Image</p>
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            rows={4}
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="Describe what you want to see in the image."
            required
          />
        </div>

        {/* Toggle */}
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer inline-block w-9 h-5">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-full h-full bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300" />
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4" />
          </label>
          <p className="text-sm">Make this Image Public</p>
        </div>

        {/* Style selection */}
        <div>
          <p className="mt-4 text-sm font-medium">Select Style</p>
          <div className="mt-3 flex gap-3 flex-wrap">
            {imageStyle.map((item, index) => (
              <span
                key={index}
                onClick={() => setselectStyle(item)}
                className={`text-sm px-4 py-1 border rounded-full cursor-pointer transition 
                  ${
                    selectStyle === item
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'text-gray-500 border-gray-300 hover:bg-purple-100'
                  }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#336BFF] to-[#2269bb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <>
              <Edit className="w-5" />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* Right column */}
      <div className="w-full md:w-1/2 max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200 min-h-96 flex flex-col">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-[#779afd]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400">
            <p className="mt-6">No image generated yet.</p>
          </div>
        ) : (
          <div className="mt-4">
            <img
              src={content}
              alt="Generated"
              className="w-full rounded-xl shadow"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Generateimg;
