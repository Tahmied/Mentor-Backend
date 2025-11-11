import { app } from "./app.js";
import { connectDatabase } from "./Utils/ConnectDb.js";

connectDatabase()
.then(()=>{
    app.listen(process.env.PORT || 1234, ()=>{
        console.log(`server is running on http://localhost:${process.env.PORT || 1234}`)
    })
})
.catch((err)=>{
    console.log(`can\'t start the server due to ${err}`)
})