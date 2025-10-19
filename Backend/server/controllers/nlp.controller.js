import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import axios from "axios"
import FormData from "form-data";


const recognise = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image was not found" });
  }

  const form = new FormData();
  form.append("file", req.file.buffer, {
    filename: "frame.jpg",
    contentType: req.file.mimetype,
  });

  const pythonServerURL = process.env.PY_URL;

  try {
    const response = await axios.post(`${pythonServerURL}/recognise`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    return res.status(200).json(
      new ApiResponse(200, response.data, "Recognition complete")
    );
  } catch (error) {
    console.error("Recognition Error:", error.message);
    throw new ApiError(401, "Backend - Recognition issue");
  }
});

const extract = asyncHandler(async(req,res)=>{
    const {sentence} = req.body

    // console.log(sentence)

    if (!sentence) {
    return res.status(400).json({ error: "sentence is required" });
  }

  const pythonServerURL = process.env.PY_URL
  console.log(pythonServerURL)

    try {
        const response = await axios.post(`${pythonServerURL}/extract`,{sentence},{
            headers: { 
                "Content-Type": "application/json" 
            } })

            if(response.status==200){
                res.status(200).json(
                    new ApiResponse(200,response.data,"Extraction successfull")
            )
            }

    } catch (error) {
        console.log(error)
        throw new ApiError(401,"Backend - Extraction issue")
    }
})

export {extract , recognise}