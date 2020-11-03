import nextConnect from 'next-connect';
import Message from '../../models/Message';
import mongooseConnection from "../../middleware/database";
import auth from '../../middleware/auth';

const handler = nextConnect();

handler.use(auth);

handler.get(async (req, res) => {
    try {
        const messages = await Message.find({});
        if(!messages) {
            res.json({error : false, messages : [], message : "No messages present"});
        } else {
            res.json({error : false, messages : messages, message : "Success"});
        }
    } catch(err) {
        console.log(err);
        res.json({error : true, message : "Internal server error"});
    }
})



export default handler;