import React, { useEffect, useState } from 'react'
import BlogSection from '../components/BlogSection';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import Tags from '../components/Tags';
import MostPopular from '../components/MostPopular';
import Trending from '../components/Trending';

const Home = ({ setActive, user }) => {

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs")
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data() })
    });
    console.log(trendBlogs);       
    setTrendBlogs(trendBlogs);      
  }

  useEffect(() => {
    getTrendingBlogs();
    const unsub = onSnapshot(collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"))
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags)
        setBlogs(list)
        setLoading(false)
        setActive('home')
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
      getTrendingBlogs();
    }
  }, [])

  console.log(trendBlogs);

  // if (loading) {
  //   return <Spinner />
  // }

  const HandleDelete = async (id) => {

    if (window.confirm('Are you sure want to delete this blog')) {
      try {
        setLoading(true);
        const docRef = doc(db, "blogs", id)
        await deleteDoc(docRef)
        toast.success("Blog deleted successfully")
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className='container-fluid pb-4 pt-4 padding'>
      <div className='container padding'>
        <div className='row mx-0'>
          <Trending blogs={trendBlogs} />
          <div className='col-md-8'>
            <BlogSection blogs={blogs} HandleDelete={HandleDelete} user={user} />
          </div>
          <div className="col-md-3">
            <Tags tags={tags} />
            <MostPopular blogs={blogs} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
