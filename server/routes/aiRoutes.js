import express from 'express' 
import { generateArticle, generateBlogtitle, generateImage, removeImageBackground, removeImageobject, reviewResume } from '../controllers/aiController.js';
import  {auth}  from '../middlewares/auth.js';
import { upload } from '../multer.js';
const aiRouter =  express.Router(); 

aiRouter.post('/generate-article' , auth  , generateArticle) ;
aiRouter.post('/generate-blog-title' , auth  ,  generateBlogtitle) ;
aiRouter.post('/generate-image' , auth  ,  generateImage) ;
aiRouter.post('/remove-image-background' , upload.single('image') ,  auth  ,   removeImageBackground) ;
aiRouter.post('/remove-image-object' , upload.single('image') ,  auth  ,   removeImageobject) ;
aiRouter.post('/resume-review' , upload.single('resume') ,  auth  ,   reviewResume) ;


 
export default aiRouter ;