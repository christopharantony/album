import './profile.css'
import Navbar from '../../Components/navbar/Navbar';
import { Avatar, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import axios from '../../axiosInstance'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2'
import { useRef } from 'react';
import CreateAlbum from '../../Components/createAlbum/CreateAlbum';

function Profile() {
    const isInitialMount = useRef(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [value, setValue] = useState({});
    const [image, setImage] = useState("");
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
        // eslint-disable-next-line
    },[])

    const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false)
    const createAlbumOpen = () => setShowCreateAlbumModal(true)
    const createAlbumClose = () => setShowCreateAlbumModal(false)

    const config = {
        headers: {
            token: localStorage.getItem('token')
        }
    }

    const changeImage = async (image) => {
        const values = new FormData();
        values.append("image", image);
        try {
            const { data } = await axios.put("/user/updateImage", values, {
                headers: {
                    "token": localStorage.getItem("token"),
                    "Content-Type": "multipart/form-data"
                },
            });
            if (data.created) {
                generateSuccess("Image updated");
            } else if (data.error) {
                generateError(data.error.message);
            } else {
                generateError("Something went wrong");
            }
        } catch (err) {
            generateError(err.response.data.error);
        }
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            changeImage(image);
        }
        // eslint-disable-next-line
    }, [image]);

    const getUserDetails = async () => {
        const { data } = await axios.get(`/user/${user._id}`, config)
        setValue(data)
    }

    const generateSuccess = (success) =>
        toast.success(success, {
            position: "bottom-right"
        })

    const generateError = (err) =>
        toast.error(err, {
            position: "bottom-right"
        })

    useEffect(() => {
        getUserDetails()
        // eslint-disable-next-line
    }, [])

    const handleSubmit = async () => {
        try {
            const { data } = await axios.put('/user', value, config)
            if (data.message === "User updated successfully") {
                generateSuccess("saved")
            }
        } catch (error) {
            generateError("Something went wrong !")
        }
    }


    const handleDelete = async () => {
        try {
            const { isConfirmed } = await
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                })

            if (isConfirmed) {
                await axios.delete('/user', config)
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                navigate('/login')
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        } catch (error) {
            generateError("Something went wrong!")
        }
    }


    return (
        <>
            <div>
                <Navbar />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <button className='albumButton' onClick={() => {
                            showCreateAlbumModal ? createAlbumClose() : createAlbumOpen()
                        }}> Add Album</button>
                        <Box sx={{ alignItems: "center" }}>

                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                id="ProfileEditImage"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    setImage(e.target.files[0]);
                                    changeImage(e.target.files[0])
                                }}
                            />
                            <label htmlFor="ProfileEditImage">

                                <Avatar
                                    alt="My Profile"
                                    src={image ? URL.createObjectURL(image) : value.pic}
                                    sx={{ width: "30rem", height: "30rem", margin:"2rem" }}
                                />

                            </label>

                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <form onSubmit={handleSubmit}>
                            <div className='main'>

                                <input className='LoginLabel' type="text" name='firstName' placeholder='firstname' value={value.firstName} onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })} />
                                <input className='LoginLabel' type="text" name='lastName' placeholder='lastname' value={value.lastName} onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })} />
                                <input className='LoginLabel' type="text" name='email' placeholder='email' value={value.email} onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })} />
                                <input className='LoginLabel' type="password" name='password' placeholder='password' value={value.password} onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })} />

                                <button type='submit' className='saveBtn'> Save
                                </button>

                            </div>
                        </form>
                        <button className='deleteBtn' onClick={() => handleDelete()}> Delete Account
                        </button>
                    </Grid>
                </Grid>
                <ToastContainer />

            </div>
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {showCreateAlbumModal && <CreateAlbum handleClose={createAlbumClose} />}
            </AnimatePresence>
        </>
    )
}

export default Profile