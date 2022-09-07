const { create , login, UserDetails, editProfile, deleteProfile, updateDp} = require('../Controllers/userController');
const {checkUser} = require('../Middlewares/authMiddleware')

const upload = require('../utils/cloudinary');
const router = require('express').Router();

router.post('/register', upload.single('pic'), create)
router.post('/login', login)

router.use(checkUser)

router.get('/:id', UserDetails)
router.put('/', editProfile)
router.delete('/', deleteProfile)
router.put('/updateImage', upload.single('image'), updateDp)


module.exports = router;