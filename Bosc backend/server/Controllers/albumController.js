
const { albumCreate, getAlbums, deleteAlbumService, albumModifyWithPhotos, albumModify, getAlbumById } = require('../Services/albumServices')

const getMyAlbums = async (req, res) => {
    try {
        const userId = req.user?._id;
        const albums = await getAlbums(userId);
        res.status(200).json(albums);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Albums not loading!!" })
    }
}

const getEditAlbum = async (req, res) => {
    try {
        const Id = req.query.id;
        console.log(Id);
        const album = await getAlbumById(Id);
        res.status(200).json(album);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const createAlbum = async (req, res) => {
    try {
        const description = req.body?.description;
        const image = req.files[0]?.path;
        const userId = req.user?._id;
        const photos = [];
        const files = req.files;
        const photoFiles = files.filter(file => file.fieldname === 'photos');
        for (const file of photoFiles) {
            const { path } = file
            photos.push(path)
        }
        const album = await albumCreate(description, image, photos, userId);
        if (album.error) {
            return res.status(401).json({ message: "Not saved successfully!" })
        }
        else {
            return res.status(200).json({ message: "Saved" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Image coundn't uploaded!!" })
    }
}

const editAlbum = async(req,res) => {
    try{
        let album;
        const Id = req.query.id;
        const description = req.body?.description;
        const image = req.files[0]?.path;
        const photos = [];
        const files = req.files;
        const photoFiles = files.filter(file => file.fieldname === 'photos');
        for (const file of photoFiles) {
            const { path } = file
            photos.push(path)
        }
        if (photoFiles.length > 0) {
            album = await albumModifyWithPhotos(description, image, photos, Id);
        } else {
            album = await albumModify(description, image, Id);
        }
        if (album.error) {
            return res.status(401).json({ error: "Not saved successfully!" })
        }
        else {
            return res.status(200).json({ message: "Saved" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong in server"})
    }
}

const deleteAlbum = async(req,res) => {
    try{
        const id = req.query.id;
        const deleted = await deleteAlbumService(id);
        if (!deleted) {
            return res.status(401).json({ message: "Couldn't Delete!" });
        }
        else {
            return res.status(200).json({ message: "Deleted successfully!" });
        }
        res.status(204).json({ deleted })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong in server"})
    }
}


module.exports = { createAlbum, getMyAlbums, getEditAlbum, editAlbum, deleteAlbum }