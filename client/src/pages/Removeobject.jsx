 import React, { useState } from 'react';
import { Edit, Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Removeobject = () => {
  const [input, setInput] = useState(null);
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error('Please upload an image');
      return;
    }

    if (object.trim().split(/\s+/).length > 1) {
      toast.error('Please enter only one object name');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content); // image URL
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col md:flex-row items-start gap-6 text-slate-700">
      {/* Form Section */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:w-1/2 bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Scissors className="w-6 h-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        <div>
          <p className="mt-6 text-sm font-medium">Upload Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setInput(e.target.files[0])}
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            required
          />
        </div>

        <div>
          <p className="mt-6 text-sm font-medium">Describe Object to Remove</p>
          <textarea
            value={object}
            onChange={(e) => setObject(e.target.value)}
            rows={4}
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="e.g., spoon or watch (only single object name)"
            required
          />
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
              Remove Object
            </>
          )}
        </button>
      </form>

      {/* Result Preview Section */}
      <div className="w-full md:w-1/2 max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200 min-h-96 flex flex-col">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#779afd]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-sm text-gray-400">
            No image processed yet
          </div>
        ) : (
          <img src={content} alt="Processed result" className="mt-3 w-full h-auto rounded-md" />
        )}
      </div>
    </div>
  );
};

export default Removeobject;
