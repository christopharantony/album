import { Delete, Edit } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2'
import axios from '../../axiosInstance';
import EditAlbum from '../editAlbum/EditAlbum';
import './MyAlbums.css'

function Albums() {
    const navigate = useNavigate()
    const [ AlbumId, setAlbumId ] = useState(null)
    const [ Albums, setAlbums] = useState([]);
    const config = {
        headers: {
            token: localStorage.getItem('token')
        }
    }

    const [showEditAlbumModal, setShowEditAlbumModal] = useState(false)
    const editAlbumOpen = () => setShowEditAlbumModal(true)
    const editAlbumClose = () => setShowEditAlbumModal(false)

    const generateError = (err) =>
        toast.error(err, {
            position: "bottom-right"
        })

    const getAlbums = async () => {
        const { data } = await axios.get('/album', config)
        console.log(data);
        setAlbums(data)
    }

    const handleDelete = async (id) => {
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
                await axios.delete(`/album?id=${id}`, config);
                navigate('/home')
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

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        } else {
            getAlbums();
        }
        // eslint-disable-next-line
    }, [navigate,showEditAlbumModal])

    return (
        <>
        { Albums.map((album) =>(
            <div className="albumContainer" style={{ backgroundImage: `url(${album.coverPic})` }}>
                <Grid container spacing={1}>
                    <Grid item xs={5}>
                        <h1 className="Albumtitle"> </h1>
                    </Grid>
                    <Grid item xs={5}>
                        <h1 className="Albumtitle">{album.description}</h1>
                    </Grid>
                    <Grid item xs={1}>
                        <Edit
                            sx={{ color: 'royalblue' }}
                            onClick={() => {
                                setAlbumId(album._id)
                                showEditAlbumModal ? editAlbumClose() : editAlbumOpen()
                            }}
                            cursor='pointer'
                            fontSize='large' />
                    </Grid>
                    <Grid item xs={1}>
                        <Delete
                            color="error"
                            fontSize='large'
                            onClick={() => handleDelete(album._id)}
                            cursor='pointer' />
                    </Grid>
                </Grid>
                <div className="AlbumList">
                {album.photos?.map((photo, index) => (
                    <div key={index} className="MyAlbum">
                        <img src={photo} alt='Not Available' className='albumPhotos' />
                    </div>
                ))}
                </div>
                <ToastContainer />
            </div>
        ))}
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {showEditAlbumModal && <EditAlbum id={AlbumId} handleClose={editAlbumClose} />}
            </AnimatePresence>
        </>
    )
}

export default Albums
