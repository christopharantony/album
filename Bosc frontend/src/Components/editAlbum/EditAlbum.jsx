import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import BackdropLanding from "../../Components/backdrop/Backdrop"
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../axiosInstance'
import { useForm } from 'react-hook-form'
import { Grid } from '@mui/material'
import _ from "lodash"
import './editAlbum.css'
import { useNavigate } from "react-router-dom";

const dropIn = {
    hidden: {
        y: "-50vh",
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 25,
            stiffness: 500
        }
    },
    exit: {
        y: "3vh",
        opacity: 0
    }
}

function EditAlbum({ handleClose, id }) {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [coverPic, setCoverPic] = useState(null)

    const config = {
        headers: {
            token: localStorage.getItem('token')
        }
    }

    const getAlbums = async () => {
        const { data } = await axios.get(`/album/editing?id=${id}`, config)
        setCoverPic(data.coverPic);
        setDescription(data.description);
    }

    useEffect(() => {
        getAlbums();
        // eslint-disable-next-line
    }, [])


    const generateError = (error) =>
        toast.error(error, {
            position: "bottom-right"
        })
    const generateSuccess = (success) =>
        toast.success(success, {
            position: "bottom-right"
        })


    const handlePost = async (data) => {

        let formData = new FormData()
        if (description) {
            formData.append('image', image)
            formData.append('description', description)
            _.forEach(data.photos, file => {
                formData.append('photos', file)
            })
            try {
                const { data } = await axios({
                    method: 'put',
                    url: `/album?id=${id}`,
                    data: formData,
                    headers: {
                        'token': localStorage.getItem("token"),
                        "Content-Type": "multipart/form-data"
                    }
                })
                if (data.message === "Saved" ) {
                    navigate('/album')
                    generateSuccess("Updated")
                    handleClose()
                } else if (data.error) {
                    generateError(data.error)
                } else {
                    generateError("Something went wrong")
                }
            } catch (error) {
                console.log('Error', error)
            }
        } else {
            generateError('Please Fill All Details!')
        }
    }


    return (
        <BackdropLanding style={Backdropstyle} onClick={handleClose}>
            <motion.div
                // drag
                onClick={(e) => { e.stopPropagation() }}
                className="CreatePost-modal bg-white"
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <header className='CreatePost-header'>
                    <Grid container spacing={3} >
                        <Grid item xs={10}>
                            <h2 className="CreatePost-Heading">Edit post</h2>
                        </Grid>
                        <Grid item xs={2}>
                            <CloseIcon fontSize='large' className="CreatePost-Close-button" onClick={handleClose} />
                        </Grid>
                    </Grid>
                </header>
                <form onSubmit={handleSubmit(handlePost)}>
                    <Grid container spacing={3} >
                        <Grid item xs={12}>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                {...register('postImage')}
                                id="CreatePostImage"
                                style={{ display: 'none' }}
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <label className="CreatePost-Image-Label" htmlFor="CreatePostImage">
                                {
                                    image ?
                                        <img src={URL.createObjectURL(image)} alt="postImage" className="CreatePost-Image" />
                                        :
                                        <img className="CreatePost-Image" src={coverPic} alt="Post" />
                                }
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="contained-button-file" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <input
                                    accept="image/*"
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    {...register('photos')} />
                            </label>
                        </Grid>
                    </Grid>
                    <footer className="CreatePost-Footer">
                        <Grid container spacing={3} >
                            <Grid item xs={9}>
                                <input
                                    className="LoginLabel"
                                    type="text"
                                    name="Description"
                                    value={description}
                                    {...register('description')}
                                    placeholder='Write something here...'
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={2}>

                                <button className="btn" type="submit">Submit</button>
                            </Grid>

                        </Grid>
                    </footer>
                </form>
            </motion.div>
            <ToastContainer />
        </BackdropLanding>
    )
}

export default EditAlbum

const Backdropstyle = {
    height: "700px"
}