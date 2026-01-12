// import dotenv from "dotenv";
// dotenv.config(); // Load .env first

// import app from "./src/app"; // make sure this path is correct
// import sequelize from "./src/database/connection";
// import adminSeeder from "./src/admin-seeder";
// import { Server } from "socket.io";
// import jwt,{JwtPayload} from 'jsonwebtoken'
// import { promisify } from "util";



// import { User } from "./src/database/models/user-model";

// interface AuthPayload extends JwtPayload {
//   id: number;
// }
// const startServer = async () => {
//   try {
//     // Test DB connection
//     await sequelize.authenticate();
//     console.log("Database authenticated successfully!");

//   await sequelize.sync({ force: false});
//     console.log("DB synced ✔");
//     await adminSeeder()
//     console.log("Admin seeder finished ✔");


//     const port = process.env.PORT || 8000;
//    const server = app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//     const io = new Server(server,{
//       cors:{
//          origin: ["http://localhost:5173", "http://localhost:3000"],
//       }
//     })
//     // io.on('connection',(socket)=>{
//     //    console.log("Client connected:", );
//     //    const{token}=socket.handshake.auth
//     //    if(token){
//     //   const decode =  await promisify(jwt.verify)(token,process.env.SECRET_KEY || "thisissecrete")
//     //    }
//     // })
// type OnlineUser = {
//   socketId: string;
//   userId: string;
//   role: string;
// };

// let onlineUsers: OnlineUser[] = [];

// const addToOnlineUsers = (
//   socketId: string,
//   userId: string,
//   role: string
// ) => {
// onlineUsers = onlineUsers.filter((user:any)=>user.userId !==userId)
//     onlineUsers.push({socketId,userId,role});
// };

// io.on("connection", async (socket) => {
//   console.log("A client connected:", socket.id);

//   try {
//     const { token } = socket.handshake.auth;

//     if (!token) {
//       socket.disconnect();
//       return;
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.SECRET_KEY || "thisissecrete"
//     ) as AuthPayload;

//     const doesUserExists = await User.findByPk(decoded.id);

//     if (!doesUserExists) {
//       socket.disconnect();
//       return;
//     }

//     addToOnlineUsers(
//       socket.id,
//       doesUserExists.id,
//       doesUserExists.role
//     );

//     console.log("Online users:", onlineUsers);

//     socket.on("updatedOrderStatus", ({ status, orderId, userId }) => {
//       const findUser = onlineUsers.find(
//         user => user.userId === userId
//       );

//       if (findUser) {
//         io.to(findUser.socketId).emit("statusUpdated", {
//           status,
//           orderId,
//         });
//       }
//     });

//     socket.on("disconnect", () => {
//       onlineUsers = onlineUsers.filter(
//         user => user.socketId !== socket.id
//       );
//       console.log("User disconnected:", socket.id);
//     });

//   } catch (error) {
//     console.log("Socket auth failed");
//     socket.disconnect();
//   }
// });

//   } catch (error:any) {
//     console.error("Unable to connect to the database:", error);
//     process.exit(1); // exit if DB connection fails
//   }
// }

// startServer();

import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";
import sequelize from "./src/database/connection";
import adminSeeder from "./src/admin-seeder";
import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "./src/database/models/user-model";

interface AuthPayload extends JwtPayload {
  id: string; // change to string if your DB id is string
}

type OnlineUser = {
  socketId: string;
  userId: string;
  role: string;
};

let onlineUsers: OnlineUser[] = [];

const addToOnlineUsers = (socketId: string, userId: string, role: string) => {
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
  onlineUsers.push({ socketId, userId, role });
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database authenticated successfully!");

    await sequelize.sync({ force: false });
    console.log("DB synced ✔");

    await adminSeeder();
    console.log("Admin seeder finished ✔");

    const port = process.env.PORT || 8000;
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
      },
    });

    io.on("connection", async (socket) => {
      console.log(" Client connected:", socket.id);

      try {
        const { token } = socket.handshake.auth;

        if (!token) {
          socket.disconnect();
          return;
        }

        const decoded = jwt.verify(
          token,
          process.env.SECRET_KEY || "thisissecrete"
        ) as AuthPayload;

        const doesUserExist = await User.findByPk(decoded.id);
        if (!doesUserExist) {
          socket.disconnect();
          return;
        }

        addToOnlineUsers(socket.id, doesUserExist.id, doesUserExist.role);
        console.log("Online users:", onlineUsers);

        // 🔥 Listen for updates
        socket.on("updateOrderStatus", ({ status, orderId, userId }) => {
          const findUser = onlineUsers.find((user) => user.userId === userId);
          if (findUser) {
            io.to(findUser.socketId).emit("statusUpdated", {
              status,
              orderId,
            });
          }
        });

        socket.on("disconnect", () => {
          onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
          console.log("y User disconnected:", socket.id);
        });
      } catch (error) {
        console.log("Socket auth failed:", (error as Error).message);
        socket.disconnect();
      }
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
