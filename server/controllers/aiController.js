 import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary'
import FormData from 'form-data';
import fs from 'fs'
import  pdf from 'pdf-parse/lib/pdf-parse.js'
// ✅ Use your actual Gemini API key from .env
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateArticle = async (req, res) => {
  try {
    console.log("🔥 Received body:", req.body); // Debugging line

    // ✅ Validate request body early
    const { prompt, length } = req.body;
    if (!prompt || !length) {
      return res.status(400).json({ success: false, message: "Missing prompt or length" });
    }
 function getTokenCount(lengthText) {
  if (lengthText.includes("300")) return 300;
  if (lengthText.includes("600")) return 600;
  if (lengthText.includes("1000")) return 1000;
  return 300; // fallback default
}
    // ✅ Access user data from Clerk
 const maxTokens = getTokenCount(length);

    const { userId } = await req.auth(); // req.auth is an object, not a function
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found." });
    }

    // ✅ Access metadata injected from auth middleware
    const plan = req.plan || "free";
    const free_usage = req.free_usage || 0;

 
 

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Limit reached. Upgrade to continue."
      });
    }

    // ✅ Send actual prompt to OpenAI
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
         max_tokens: maxTokens,
    });

    const content = response.choices?.[0]?.message?.content;

    // ✅ Save to database
    await sql`INSERT INTO creations (user_id, prompt, content, type)
          VALUES (${userId}, ${prompt}, ${content}, 'article')`;


    // ✅ Update free usage if user is not premium
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error("❌ generateArticle error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};





 export const generateBlogtitle = async (req, res) => {
  try {
    console.log("🔥 Received body:", req.body);

    // ✅ Validate request body early
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Missing prompt" });
    }

    // ✅ Access user data from Clerk
    const { userId } = req.auth(); // make sure req.auth is a function
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found." });
    }

    // ✅ Generate title using Gemini (or whichever AI you're using)
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const content = response.choices?.[0]?.message?.content;

    // ✅ Save to database (optional)
    await sql`INSERT INTO creations (user_id, prompt, content, type)
              VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    res.json({ success: true, content });

  } catch (error) {
    console.error("❌ BlogTitle error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};


 export const generateImage = async (req, res) => {
  try {
    console.log("🔥 Received body:", req.body);

    const { prompt, publish } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Missing prompt" });
    }

    const { userId } = req.auth || {};
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found." });
    }

    const plan = req.plan || "free";
    const free_usage = req.free_usage || 0;

    if (plan !== "free" && plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available in the premium plan."
      });
    }

 const form = new FormData();
form.append('prompt', prompt);

const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", form, {
  headers: {
    'x-api-key': process.env.CLIPDROP_API_KEY,
    ...form.getHeaders()  // ✅ required
  },
  responseType: "arraybuffer"
});


    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish)
              VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.error("❌ Generate Image error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};


 export const removeImageBackground = async (req, res) => {
  try {
    console.log("🔥 Received body:", req.body);

    const image = req.file;
    if (!image) {
      return res.status(400).json({ success: false, message: "No image file uploaded." });
    }

    const { userId } = req.auth || {};
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found." });
    }

    const plan = req.plan || "free";
    const free_usage = req.free_usage || 0;

    if (plan !== "free" && plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available in the premium plan."
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background"
        }
      ]
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.error("❌ Remove Image Background error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};





 export const removeImageobject = async (req, res) => {
  try {
    console.log("🔥 Received body:", req.body);

    const image = req.file;
    const { object } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: "No image file uploaded." });
    }

    if (!object || object.trim().split(/\s+/).length > 1) {
      return res.status(400).json({ success: false, message: "Please provide only one object name." });
    }

    const { userId } = req.auth || {};
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found." });
    }

    const plan = req.plan || "free";
    const free_usage = req.free_usage || 0;

    if (plan !== "free" && plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available in the premium plan.",
      });
    }

    // Upload the image
    const { public_id } = await cloudinary.uploader.upload(image.path);

    // Apply transformation
    const image_url = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    // Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${image_url}, 'image')
    `;

    res.json({ success: true, content: image_url });

  } catch (error) {
    console.error("❌ Remove Image Object Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};



  export const    reviewResume = async (req, res) => {
  try {
    console.log("🔥 Received body:", req.body);

     const resume =  req.file  ; 
     

    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found." });
    }
     const plan = req.plan || "free";
    const free_usage = req.free_usage || 0;

    if (plan !== "free" && plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available in the premium plan."
      });
    }

  
 
    if(resume.size > 5 *1024 *1024 ){
      return res.json({success: false  , message : " resume file size is greter than 5 mb"})
    }

    const dataBuffer = fs.readFileSync(resume.path)
    const  pdfData =  await  pdf(dataBuffer) ;

    const prompt =` Review the following resume and provide constructive  feedback on
     its Strength weakness and areas from improvement. Resume Content:\n\n${pdfData.text}
`
     const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices?.[0]?.message?.content;

  await sql `INSERT INTO creations (user_id, prompt, content, type)
          VALUES (${userId}, 'Review the uploaded Resume', ${resume}, 'image');
`

    res.json({ success: true, content });

  } catch (error) {
    console.error("❌ Generate Image error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};