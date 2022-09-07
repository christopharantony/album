const { userCreate, isUserExist, userLogin, userByIdService, updateUser, deleteUser, profilePicChanger } = require("../Services/userServices");
const { createToken } = require("../utils/generateToken");

const create = async (req, res) => {
    try {
        const exist = await isUserExist(req.body.email, req.body.userName);
        if (!exist) {
            console.log('Im here');
            const pic = req.file ? req.file.path : "https://www.w3schools.com/howto/img_avatar.png";
            const user = await userCreate(req.body, pic);
            return res.status(200).json(user)
        }
        else {
            return res.status(401).json({ message: "User already exist!" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userLogin(email, password);
        if (user) {

            const token = createToken(user?._id, 'user')
            res.status(200).json({ user: user, created: true, token })
        }
        else {
            res.json({ error: "Invalid Credentials" })
        }

    } catch (error) {
        res.json({ error: "Invalid User id and Password", created: false })
    }
}


const UserDetails = async (req, res) => {
    const userId = req.params.id;
    const user = await userByIdService(userId);
    return res.status(200).json(user);
}

const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName,
            lastName,
            email,
            password } = req.body;
        await updateUser(
            userId,
            firstName,
            lastName,
            email,
            password
        )
        const user = await userByIdService(userId);
        return res.status(200).json({
            message: "User updated successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong", error })
    }
}


const deleteProfile = async (req, res) => {
    try {
        await deleteUser(req.user._id)
        res.status(200).json({ message: "Deleted successfully.👍" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}


const updateDp = async (req, res) => {
    try {
        const image = req.file?.path;
        const userId = req.user?._id;
        const user = await profilePicChanger(userId, image);
        return res.status(200).json({
            created: true,
            message: "Profile image updated successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong", error })
    }
}


module.exports = { create, login, UserDetails, editProfile, deleteProfile, updateDp };