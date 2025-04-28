import cron from "cron";
import https from "https";
import { API_URL } from "../config";

const job=new cron.CronJob("*/14 * * * *", () => {
  https.get(API_URL!,(res)=>{
    if(res.statusCode===200){
      console.log("Cron job is running");
    }
    else{
      console.log("Cron job is not running");
    }
  })
    })
export default job;
