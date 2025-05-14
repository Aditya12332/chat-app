import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async(req,res) => {
    try {
        const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({_id: {$ne: loggedInUserId }}).select("-password")
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
    
}

export const getMessages = async(req,res) => {
    try {
    const { id: userToChatId } = req.params;
    const loggedInUserId = req.user._id;

    
        const messages = await Message.find({
            $or: [
                { sender: loggedInUserId, receiver: userToChatId },
                { sender: userToChatId, receiver: loggedInUserId },
            ],
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async(req,res) => {
    try {
        const { id: recieverId } = req.params;
        const {text, image} = req.body;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image
        });
        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage:", error.message);


    }
}