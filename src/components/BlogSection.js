import React from 'react'
import { excerpt } from '../utility'
import { Link } from 'react-router-dom';
import {RiDeleteBin6Line} from 'react-icons/ri'
import {GrEdit} from 'react-icons/gr'

const BlogSection = ({ blogs, user, HandleDelete }) => {
    return (
        <div>
            <div className='blog-heading text-start py-2 mb-4'>Daily Blogs</div>
            {blogs?.map((item) => {
                return <div className='row pb-4' key={item.id}>
                    <div className='col-md-5'>
                        <div className='hover-blogs-img'>
                            <div className='blogs-img'>
                                <img src={item.imgUrl} alt={item.title} />
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-7'>
                        <div className='text-start'>
                            <h6 className='category catg-color'>{item.category}</h6>
                            <span className='title py-2'>{item.title}</span>
                            <span className="meta-info">
                                <p className="author">{item.author}{" "}{"-"}{" "}</p>
                                {item.timestamp.toDate().toDateString()}
                            </span>
                        </div>
                        <div className='short-description'>
                            {excerpt(item.description, 120)}
                        </div>
                        <Link to={`/detail/${item.id}`}>
                            <button className='btn btn-read'> Read More</button>
                        </Link>
                        {user?.uid && item.userId === user.uid && (
                            <div style={{ float: 'right' }}>
                                <RiDeleteBin6Line onClick={() => HandleDelete(item.id)} style={{ width: '2rem', height: '2rem', marginRight: '1rem', borderRadius: '60%',cursor:'pointer' }} />
                                <Link to={`/update/${item.id}`}>
                                    <GrEdit style={{ width: '2rem', height: '2rem', marginRight: '1rem', borderRadius: '60%' }}/>
                                </Link>
                            </div>           
                        )}

                    </div>
                </div>
            })}
        </div>
    )
}

export default BlogSection
