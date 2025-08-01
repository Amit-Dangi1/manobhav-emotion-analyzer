// import brain from 'brain.js';
import { get } from 'mongoose';
import { UserBehaviorData } from '../model/userbehaviordata_model.js';
import { MoodLevel } from '../model/moodlevels_model.js';
import { response } from 'express';
// import { Prediction } from '../model/prediction_model.js';

    export const predictBehavior = async (req, res) => {
        try {
            const userId = req.user._id;
            const recentData = await UserBehaviorData.find({ userId }).sort({ createdAt: -1 }).limit(5);
            if(!recentData)
                return response.status(404).json({message:"No Data Found to Predict"})
            if (recentData.length === 0) {
                return res.status(404).json({ message: "Not enough data to predict" });
            }
             let getRecentData = recentData[0];
// console.log(getRecentData);
 console.log("moodlevel:", getRecentData.moodlevel);
// console.log("stressLevel:", getRecentData.stresslevel);
// console.log("peerInfluence:", getRecentData.peerInfluence);
// console.log("sleepHours:", getRecentData.sleepHours);
            
            let getmoodLevel =Number(getRecentData.moodlevel)+ Number((10-getRecentData.stressLevel))+Number((10-getRecentData.peerInfluence)) + Number(getRecentData.sleepHours);
            let calculatelevel = Math.round(getmoodLevel/4);
            console.log("cal = ",calculatelevel);
            // console.log("getRecentData.stressLevel-10) = ",10-getRecentData.stressLevel);
            // console.log("getRecentData.peerInfluence-10 = ",10-getRecentData.peerInfluence);
            
            
            let findmood = await MoodLevel.findOne({moodlevel:calculatelevel});
            // const net = new brain.NeuralNetwork();

            // net.train([
            //     { input: { stressLevel: 3, sleepHours: 7 }, output: { positiveMood: 1 } },
            //     { input: { stressLevel: 8, sleepHours: 4 }, output: { positiveMood: 0 } }
            // ]);

            // const latestInput = recentData[0];

            // const output = net.run({
            //     stressLevel: latestInput.stressLevel,
            //     sleepHours: latestInput.sleepHours
            // });

            // const prediction = new Prediction({
            //     userId,
            //     result: output.positiveMood >= 0.5 ? "Positive" : "Negative",
            //     predictionaccuracy: Math.round(output.positiveMood * 100)
            // });
            // await prediction.save();

            res.status(200).json({ message: "Prediction Done", findmood });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
