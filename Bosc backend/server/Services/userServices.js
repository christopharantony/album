const UserDB = require('../Models/userModel');
const bcrypt = require('bcrypt');
const { findByIdAndDelete } = require('../Models/userModel');

const userCreate = async (data, pic) => {
    try {
        const { userName, firstName, lastName, email, password } = data;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await UserDB.create({
            userName,
            firstName,
            lastName,
            email,
            pic,
            password: hashPassword
        })
        console.log("result",user);
        return user;
    } catch (error) {
        console.log(error);
    }

}

const isUserExist = async (email, userName) => {
    try {
        const user = await UserDB.findOne({ $or: [{ email }, { userName }] })
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}


const userLogin = async (email, password) => {
    try {
        const user = await UserDB.findOne({ email }).select('-password');
        const data = await UserDB.findOne({ email });
        if (user) {

            const isMatch = await bcrypt.compare(password, data.password);
            if (isMatch) {
                return user;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}


const userByIdService = async (id) => {
    try {
        const user = await UserDB.findByIdAndUpdate(id).select('-password');
        return user;
    } catch (error) {
        console.log(error)
    }
}


const updateUser = async (id, firstName, lastName, email, password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await UserDB.findByIdAndUpdate(id, {
            firstName, lastName, email, password: hashPassword
        }).select('-password');
        return user;
    } catch (error) {
        console.log(error)
    }
}

const deleteUser = async (id) => {
    await UserDB.findByIdAndDelete(id)

}


const profilePicChanger = async (id, image) => {
    try {
        const user = await UserDB.findByIdAndUpdate(id, {
            pic: image
        }).select('-password');
        return user;
    } catch (error) {
        console.log(error)
    }
}

module.exports = { userCreate, isUserExist, userLogin, userByIdService, updateUser, deleteUser, profilePicChanger };