
import dbConnect, { connectKaro } from "./app/db/dbConnect";


export function register(){
  dbConnect();
  console.log("code touch register");
}