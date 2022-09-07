const AlbumDB = require('../Models/albumModel');

const albumCreate = async (description, coverPic, photos, createdBy) => {
    try {
        const album = await AlbumDB.create({
            coverPic, description, photos, createdBy
        })
        return album;

    } catch (error) {
        console.log(error);
        return { error }
    }
}

const getAlbums = async (createdBy) => {
    try {
        const albums = await AlbumDB.find({ createdBy });
        return albums;
    } catch (error) {
        console.log(error);
        return { error }
    }
}

const albumModifyWithPhotos = async (description, coverPic, photos, _id) => {
    try {
        const album = await AlbumDB.updateOne({ _id }, {
            $set: { coverPic, description, photos }
        })
        return album;
    } catch (error) {
        return { error }
    }
}

const getAlbumById = async (id) => {
    try {
        const album = await AlbumDB.findById(id);
        return album;
    } catch (error) {
        console.log(error);
        return { error }
    }
}
const albumModify = async (description, coverPic, _id) => {
    try {
        const album = await AlbumDB.updateOne({ _id }, {
            $set: { coverPic, description }
        })
        return album;
    } catch (error) {
        return { error }
    }
}

const deleteAlbumService = async (id) => {
    try {
        await AlbumDB.deleteOne({ _id: id });
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { albumCreate, getAlbums, deleteAlbumService, getAlbumById, albumModifyWithPhotos, albumModify }