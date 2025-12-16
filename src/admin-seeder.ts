import { User } from "./database/models/user-model"
import bcrypt from 'bcrypt'


const adminSeeder = async()=>{
try {
    const data  =  await User.findOne({
        where:{email:'ankitchau2061@gmail.com'}
    })

    if(!data){
        await User.create({
            username:'ankit chaudhary',
            email:'ankitchau2061@gmail.com',
            password:bcrypt.hashSync("test123", 12),
            role:'admin'
        })
       console.log("Admin credential created successfully");
    }else{
         console.log("Admin credential is already seeded");
    }
} catch (error:any) {
     console.error("Seeder error:", error); 
}
}


export default adminSeeder