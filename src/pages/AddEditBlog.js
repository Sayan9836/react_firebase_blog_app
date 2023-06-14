import React, { useEffect, useState } from 'react'
import ReactTagInput from '@pathofdev/react-tag-input'
import "@pathofdev/react-tag-input/build/index.css";
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: ""

}

const categoryOptions = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
]


const AddEditBlog = ({ user, setActive }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(null);
   const [isUploaded,setIsUploaded]=useState(true)

  const { title, tags, trending, category, description } = form;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    id && getBlogDetail()
  }, [id])

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    if (snapshot) {
      setForm({ ...snapshot.data() })
    }
    setActive(null);
  }
  useEffect(() => {
    const uploadFile = () => {
      
      const storageref = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageref, file);
      uploadTask.on("state_changed", (snapshot) => {
        setIsUploaded(false);
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progress)
        switch (snapshot.state) {
          case "paused":
            console.log("upload is paused");
            break
          case "running":
            console.log("upload is running");
            break;
          default:
            break;
        }
      },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info('Image uploaded to Firebase Succesfully')
            setIsUploaded(true);
            setForm({ ...form, imgUrl: downloadUrl });
          })
        }
      )
    };


   
    file && uploadFile();
  }, [file])

  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const HandleTags = (tags) => {
    setForm({ ...form, tags })
  }
  const HandleTrending = (e) => {
    setForm({ ...form, trending: e.target.value })
  }
  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value })
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags && title && description && trending) {
      if (!id) {
        try {
          await addDoc(collection(db, "blogs"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid
          })
          toast.success("Blog created successfully")
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const docRef = doc(db, "blogs", id);
          await updateDoc(docRef, {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid
          })
          toast.success("Blog updated successfully")
        } catch (error) {
          console.log(error);
        }
      }
      navigate('/')
    } else {
      toast.error('All fields are mandatory to fill')
    }
  
  }

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12">
          <div className="text-center heading py-2">
            {id ? "Update Blog" : "Create Blog"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row blog-form" onSubmit={HandleSubmit}>
              <div className='col-12 py-3'>
                <input
                  type="text"
                  className='form-control input-text-box'
                  placeholder='Title'
                  name='title'
                  value={title}
                  onChange={HandleChange}
                />
              </div>
              <div className='col-12 py-3'>
                <ReactTagInput tags={tags} placeholder='Tags' onChange={HandleTags} />

              </div>
              <div className='col-12 py-3'>
                <p className='trending'> is it a Trending blog&nbsp; ?</p>
                <div className='form-check-inline mx-2'>
                  <input
                    type="radio"
                    className='form-check-input'
                    name='radioOption'
                    value="yes"
                    checked={trending === "yes"}
                    onChange={HandleTrending}

                  />
                  <label htmlFor='raduioOption' className='form-check-label'>yes&nbsp;</label>
                  <input
                    type="radio"
                    className='form-check-input'
                    name='radioOption'
                    value="no"
                    checked={trending === "no"}
                    onChange={HandleTrending}

                  />
                  <label htmlFor='raduioOption' className='form-check-label'>No</label>
                </div>
              </div>
              <div className='col-12 py-3'>
                <select
                  value={category}
                  onChange={onCategoryChange}
                  className='catg-dropdown'
                >
                  <option value="" key="">please select category</option>
                  {categoryOptions?.map((option, index) => (
                    <option value={option || ""} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-12 py-3'>
                <textarea
                  cols="30"
                  rows="10"
                  className='form-control description-box'
                  placeholder='Description'
                  value={description}
                  name='description'
                  onChange={HandleChange}
                />
              </div>
              <div className='mb-3'>
                <input
                  type="file"
                  className='form-control'
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className='col-12 py-3 text-center'>
                <button disabled={!isUploaded} className='btn btn-add' type='submit'>
                  {id ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AddEditBlog
