 import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { dummyPublishedCreationData } from '../assets/assets';
import { Heart } from 'lucide-react';
import axios from  'axios';
import toast from 'react-hot-toast';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const {getToken} =  useAuth() ; 


  const fetchCreations = async () => {
 try {
  const {data} =  await axios.get('/api/user/get-published-creations' , {
    headers : {Authorization :  `Bearer ${await getToken()}`}
  })

  if ( data.success ) {
    setCreations(data.creations)
  }
  else{
      toast.error( data.message)

  }
 } catch (error) {
  toast.error( error.message)
 }
 setLoading(false) ;
  };
  const imagelikeToggle =  async(id)=>{
    try {
        const {data} =  await axios.post('/api/user/toggle-like-creations' ,{id} , {
    headers : {Authorization :  `Bearer ${await getToken()}`}
  })
  if ( data.success){
    toast.success(data.message) 
    await fetchCreations()
  }else {
    toast.error(data.message)
  }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) fetchCreations(); // ✅ You forgot to call the function
  }, [user]);

  return   ! loading ?  (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold mb-4">Creations</h1>
      <div className="bg-white h-full w-full rounded-xl overflow-y-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group w-full rounded-lg overflow-hidden"
          >
            <img
              src={creation.content}
              alt=""
              className="w-full h-60 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-b from-transparent to-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm mb-2">{creation.prompt}</p>
              <div className="flex items-center gap-1">
                <p>{creation.likes.length}</p>
                <Heart  onClick={ ()=>imagelikeToggle(creation.id) }
                  className={`w-5 h-5 cursor-pointer ${
                    creation.likes.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
  <span className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></span>
</div>

  )
};

export default Community;
