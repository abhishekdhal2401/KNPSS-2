import Member from "../../models/member";
import mongooseCollection from "../../middleware/database";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const member = new Member({
    name: body.name,
    dob: body.dob,
    occupation: body.occupation,
    qualification: body.qualification,
    address: body.address,
    phone: body.phone,
    email: body.email,
    sonOf: body.sonOf,
  });
  try {
   const result = await member.save();
   if (result) {
     res.json({success:true});
   } else {
     res.json({success:false,err:"document not saved"});
   }
  } catch (error) {
    res.json({ success: false, err: error });
  }

  // console.log(req.body);
  // res.json(req.body);
};
