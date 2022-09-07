const router = require('express').Router();
const {createAlbum, getMyAlbums, deleteAlbum, getEditAlbum, editAlbum}  = require('../Controllers/albumController')
const {checkUser} = require('../Middlewares/authMiddleware');
const { getAlbums } = require('../Services/albumServices');
const upload = require('../utils/cloudinary');

router.use(checkUser)

router.get('/', getMyAlbums );
router.get('/editing', getEditAlbum)
router.post('/', upload.any(), createAlbum );
router.put('/', upload.any(), editAlbum);
router.delete('/', deleteAlbum)

module.exports = router;





















// router.post('/',  upload.array('photos'), createAlbum )
// router.post('/',  upload.single('image'), createAlbum )