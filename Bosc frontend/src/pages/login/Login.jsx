import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify';
import './login.css'
import axios from '../../axiosInstance'

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({});
    useEffect(() => {
        if(localStorage.getItem('token')){
            navigate('/home')
        }
    })

    const generateError = (err) =>
    toast.error(err, {
        position: "bottom-right"
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (values.email === "" || values.password === "") {
                generateError("Please fill all the fields");
                return;
            }
            const { data } = await axios.post("/user/login", values);
            if (data) {
                if (data.error) {
                    generateError("Invalid user id or Password");
                    return;
                }
                else if (data.user && data.created) {
                  
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error);
            generateError("Something went Wrong!");
        }
    }



  return (
    <div style={{ overflow: "hidden" }}>

      <div className="area" >

        <div className="contextLogin">

          <div className='container'>
            <h1>Login Account</h1>
            <form className='LoginForm'
            onSubmit={(e) => handleSubmit(e)}
            >
              
              <div className='FormFields'>
                <label htmlFor="email">Email</label>
                <input className='LoginLabel' type="email" name="email" placeholder="Email" 
                onChange={(e) => {setValues({ ...values, [e.target.name]: e.target.value })}}
                  />
              </div>

              <div className='FormFields'>
                <label htmlFor="password">Password</label>
                <input className='LoginLabel' type="password" name="password" placeholder="Password" 
                onChange={(e) => {setValues({ ...values, [e.target.name]: e.target.value })}}
                  />
              </div>
              


              <button className='SubmitButton' type='submit'>Submit</button>
              <span>Already have an account? 
                <Link className='link' to={'/register'}>Register</Link></span>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div >

    </div>
  )
}

export default Login