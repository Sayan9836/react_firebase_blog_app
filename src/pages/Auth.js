import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'


const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: ""
}
const Auth = ({ setActive }) => {
  const [state, setState] = useState(initialState)
  const [signUp, setSignUp] = useState(false)
  const navigate = useNavigate();
  const { email, password, firstName, lastName, confirmPassword } = state;

  const HandleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!signUp) {
      if (email && password) {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        if (!user) {
          return toast.error("email or password is incorrect")
        }
        setActive("home") 

      }
    } else {
      if (password !== confirmPassword) {
        return toast.error("password do not match")
      }
      if (firstName && lastName && email && password) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(user, { displayName: `${firstName} ${lastName}` })
        setActive("home")
      } else {
        return toast.error("All field are mandatory to fill")
      }
    }
    navigate("/");
  }
  return (
    <div className='container-fluid mb-4'>
      <div className="container">
        <div className='col-12 text-center'>
          <div className="text-center heading py-2">
            {!signUp ? "Sign-In" : "Sign-Up"}
          </div>
        </div>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-10 col-md-8 col-lg-6'>
            <form className='row' onSubmit={handleAuth}>
              {
                signUp && (
                  <>
                    <div className='col-6 py-3'>
                      <input
                        type="text"
                        className='form-control input-text-box'
                        placeholder='first Name'
                        name='firstName'
                        value={firstName}
                        onChange={HandleChange}
                      />
                    </div>
                    <div className='col-6 py-3'>
                      <input
                        type="text"
                        className='form-control input-text-box'
                        placeholder='last Name'
                        name='lastName'
                        value={lastName}
                        onChange={HandleChange}
                      />
                    </div>
                  </>
                )
              }
              <div className='col-12 py-3'>
                <input
                  type="email"
                  className='form-control input-text-box'
                  placeholder='Email'
                  name='email'
                  value={email}
                  onChange={HandleChange}
                />
              </div>
              <div className='col-12 py-3'>
                <input
                  type="password"
                  className='form-control input-text-box'
                  placeholder='password'
                  name='password'
                  value={password}
                  onChange={HandleChange}
                />
              </div>
              {
                signUp && (
                  <div className='col-12 py-3'>
                    <input
                      type="pasword"
                      className='form-control input-text-box'
                      placeholder='Confirm Password'
                      name='confirmPassword'
                      value={confirmPassword}
                      onChange={HandleChange}
                    />
                  </div>
                )
              }

              <div className='col-12 py-3 text-center'>
                <button
                  className={`btn ${!signUp ? "btn-sign-in" : "btn-sign-up"}`}
                  type="submit"
                >
                  {!signUp ? "Sign-In" : "Sign-Up"}
                </button>
              </div>
            </form>
            <div>
              {!signUp ? (
                <>
                  <div className='text-center justify-content-center mt-2 pt-2'>
                    <p className='small fw-bold mt-2 pt-1 mb=0'>
                      Don't have an account ?&nbsp;
                      <span className='link-danger' style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => setSignUp(true)}>
                        Sign Up
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className='text-center justify-content-center mt-2 pt-2'>
                    <p className='small fw-bold mt-2 pt-1 mb=0'>
                      Already have an account ?&nbsp;
                      <span className='link-primary' style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => setSignUp(false)}>
                        Sign In
                      </span>
                    </p>
                  </div>
                </>
              )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
