 import React, { useState } from 'react';
import { Sparkles, Edit, ImageIcon , Eraser } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

axios.defaults.baseURL =  import.meta.env.VITE_BASE_URL  ; 

const Generateimg = () => {
  const  imageStyle = [
    'Realistic', 'Ghibli', 'Anime', '3D', 'Lifestyle', 
  ];

   const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
  
    const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();


    try {
       setLoading(true);

    const formData = new  FormData() ; 
    formData.append('image' , input)
       const { data } = await axios.post(
        '/api/ai/remove-image-background ',
       formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content); // should be image URL or base64
      } else {
        toast.error(data.message);
      }
    }
      
     catch (error) {
              toast.error(error.message);


    }
    setLoading(false) ;
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
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        {/* Keyword input */}
        <div>
          <p className="mt-6 text-sm font-medium">  Upload Image</p>
          <  input
            onChange={(e) => setInput(e.target. files[0])}
             
            rows={4}
             type = "file"
            accept="image/*"
             className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
           
            required
          />
        </div>
 


     
<p className='text-xs text-gray font mt-1'>
  supporting jpg , jpeg , png and other formats
</p>
        {/* Submit Button */}
        <button
                 disabled={loading}
                 className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#336BFF] to-[#2269bb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
               >
                 {loading ? (
                   <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"></span>
                 ) : (
                   <>
                     <Edit className="w-5" />
                     Remove Background 
                   </>
                 )}
               </button>
      </form>

      {/* Right column */}
      <div className="w-full md:w-1/2 max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200 min-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#779afd]" />
          <h1 className="text-xl font-semibold"> Processed image</h1>
        </div>

        {/* Placeholder */}

        {
          ! content ? (
                  <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
            <Eraser className="w-9 h-9" />
            <p>
               Upload an image  and click <strong>"Remove  Baxkground"</strong> to get started.
            </p>
          </div>
        </div>
          ) :(

            <img src={content} alt='image' className='my-3 w-full h-full'/>
          )

        }
   
      </div>
    </div>
  );
};

export default  Generateimg;
