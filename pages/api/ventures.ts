import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import getDb from "@/utils/getdb";


const SERVER_ERR_MSG = "Something went wrong in a server.";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET':
      // Handle GET request
      getVentures(res)
      break
    case 'POST':
      // Handle POST request
      createVenture(req, res);
      break
    case 'PUT':
      // Handle PUT request
      updateVenture(req, res);
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function createVenture(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = req.body;
    const db = await getDb();
    
    const courseId = new ObjectId(data.course.toString());
    const course = await db
      .collection("courses")
      .findOne({ _id: courseId });
    // Prepare data to input into database
    let ventures: Array<any> = [];
    let collabs: Array<any> = [];
    let emailsOfMentees: Array<string> = [];
    let emailsOfMentors: Array<string> = data.mentors.map((mentor: any) => {
      return mentor.email;
    });
    const collabId = new ObjectId();

    let menteeSelected = false;
    if (data.mentees.length > 0) {
      menteeSelected = true;
      data.mentees.map((mentee: any, idx: number) => {
        const cId = new ObjectId();
        emailsOfMentees.push(mentee.email);
        ventures.push({
          title: data.title, 
          course: course, 
          description: data.description,
          mentee: mentee,
          mentors: data.mentors,
          updatedAt: new Date(),
          createdAt: new Date(),
          isArchive: false,
          isTeam: data.isTeam,
          collabId: data.isTeam ? collabId : cId
        });
        collabs.push({
          _id: cId, comments: [], mentees: data.mentees, mentors: data.mentors
        })
      });
    } else {
      ventures.push({
        title: data.title, 
        course: course, 
        description: data.description,
        mentee: null,
        mentors: data.mentors,
        updatedAt: new Date(), 
        createdAt: new Date(),
        isArchive: false,
        isTeam: data.isTeam,
        collabId: collabId
      });
    }
    // const menteeList = await db.collection("users")
    //   .find(
    //     {
    //       email: { $in: emailsOfMentees }
    //     }
    //   ).toArray();
    // const mentorList = await db.collection("users")
    //   .find(
    //     {
    //       email: { $in: emailsOfMentors }
    //     }
    //   ).toArray();
    // console.log(menteeList);
    // console.log(mentorList);

    const collabDoc = { _id: collabId, comments: [], mentees: data.mentees, mentors: data.mentors };
    let resultCollab;

    if (!data.isTeam && data.mentees.length > 0) {
      resultCollab = await db.collection("collaborations").insertMany(collabs)
    } else {
      resultCollab = await db.collection("collaborations").insertOne(collabDoc)
    }

    const result = await db
      .collection("ventures")
      .insertMany(ventures);
    if (!result.acknowledged || !resultCollab.acknowledged) {
      res.status(500).json({ success: false, err: SERVER_ERR_MSG });
    } else {
      let ids: any[] = [];
      if (menteeSelected) {
        let ventureArrayForMentors: any[] = [];
        for(var i = 0; i < result.insertedCount; i++) {
          const insertedId = result.insertedIds[i];
          ids.push(insertedId);
          await db
            .collection("users")
            .updateOne(
              { email: emailsOfMentees[i] },
              { 
                $push: { 
                  ventures: 
                  {
                    ventureId: insertedId,
                    role: "mentee",
                    status: "awaiting"
                  }
                } 
              }
          );
          ventureArrayForMentors.push({
            ventureId: insertedId,
            role: "mentor",
            status: "awaiting"
          });
        }
        await db
          .collection("users")
          .updateMany(
            { email: { $in: emailsOfMentors } },
            { $push: { ventures: { $each: ventureArrayForMentors } } }
        );
      } else {
        ids.push(result.insertedIds[0]);
      }
      const newVentures = await db
        .collection("ventures")
        .find({ _id: { $in: ids } }).toArray();
      
        
        console.log(newVentures)
      await db
        .collection("courses")
        .updateOne({ _id: courseId }, { $set: { ventures: course.ventures + result.insertedCount } });
      res.status(200).json({ success: true, ventures: newVentures });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function getVentures(res: NextApiResponse) {
  try {
    const db = await getDb();
    
    const result = await db
      .collection("ventures")
      .find({ isArchive: false })
      .sort({
        "createdAt": -1,
        "updatedAt": -1, 
        "title": 1,
      }).toArray();
    
    const ventureList = result.map((venture: any) => {
      return {
        _id: venture._id,
        title: venture.title,
        course: {
          _id: venture.course._id,
          title: venture.course.title,
          description: venture.course.description,
        },
        description: venture.description,
        isTeam: venture.isTeam,
        mentee: venture.mentee,
        mentors: venture.mentors,
        createdAt: venture.createdAt,
        updatedAt: venture.updatedAt,
      };
    })
    res.status(200).json({ ventures: ventureList });
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}

async function updateVenture(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, prevCourseId, data } = req.body;
    const courseId = new ObjectId(data.course.toString());
    const oldCourseId = new ObjectId(prevCourseId.toString());
    const ventureId = new ObjectId(id.toString());
    const db = await getDb();
    

    if (data.course != prevCourseId) {
      const newCourseData = await db
        .collection("courses")
        .findOne({ _id: courseId });

      const oldCourseData = await db
        .collection("courses")
        .findOne({ _id: oldCourseId });

      const result = await db
        .collection("ventures")
        .updateOne({
          _id: ventureId
        }, {
          $set: {
            title: data.title,
            course: newCourseData,
            description: data.description,
            updatedAt: new Date()
          }
        });
      if (!result.matchedCount) {
        res.status(500).json({ err: SERVER_ERR_MSG });
      } else {
        const venture = await db
          .collection("ventures")
          .findOne({ _id: ventureId });

        await db
          .collection("courses")
          .updateOne({ _id: courseId }, { $set: { ventures: newCourseData.ventures + 1 } });

        await db
          .collection("courses")
          .updateOne({ _id: oldCourseId }, { $set: { ventures: oldCourseData.ventures > 0 ? oldCourseData.ventures - 1 : 0 } });
        res.status(200).json({ success: true, venture: venture });
      }
    } 
    else {
      const result = await db
        .collection("ventures")
        .updateOne({
          _id: ventureId
        }, {
          $set: {
            title: data.title,
            description: data.description,
            updatedAt: new Date(),
            mentee: data.mentee,
            mentors: data.mentors
          }
        });
      if (!result.matchedCount) {
        res.status(500).json({ err: SERVER_ERR_MSG });
      } else {
        // Begin - add ventures to new mentors
        let ventureArrayForMentors: any[] = [];
        let emailsOfMentors: Array<string> = [];
        let emailsOfRemovedMentors: Array<string> = [];
        // for(var i = 0; i < data.addedMentors; i++) {
        //   emailsOfMentors.push(data.addedMentors[i].email);
        //   ventureArrayForMentors.push({
        //     ventureId: ventureId,
        //     role: "mentor",
        //     status: "awaiting"
        //   });
        // }

        // for(var i = 0; i < data.removedMentors; i++) {
        //   emailsOfRemovedMentors.push(data.removedMentors[i].email);
        // }

        data.addedMentors.map((item: any, i: number) => {
          emailsOfMentors.push(item.email);
          ventureArrayForMentors.push({
            ventureId: ventureId,
            role: "mentor",
            status: "awaiting"
          });
        });

        data.removedMentors.map((item: any, i: number) => {
          emailsOfRemovedMentors.push(item.email);
        })
        // await db
        //   .collection("users")
        //   .updateMany(
        //     { 
        //       email: { $in: emailsOfMentors },
        //       ventures: { $exists: false }
        //     },
        //     { $set: { ventures: [] } }
        // );

        await db
          .collection("users")
          .updateMany(
            { email: { $in: emailsOfMentors } },
            // { $push: { ventures: { $each: ventureArrayForMentors } } }
            { $addToSet: { ventures: { $each: ventureArrayForMentors } } }
        );
        // End - add ventures to new mentors

        // Begin - add venture to mentee
        if (data.mentee != null) {
          // await db
          //   .collection("users")
          //   .updateOne(
          //     { 
          //       email: data.mentee.email,
          //       ventures: { $exists: false }
          //     },
          //     { 
          //       $set: { ventures: [] } 
          //     }
          // );
          await db
            .collection("users")
            .updateOne(
              { email: data.mentee.email },
              // { 
              //   $push: { 
              //     ventures: { 
              //       $each: [
              //         {
              //           ventureId: ventureId,
              //           role: "mentee",
              //           status: "awaiting"
              //         }
              //       ] 
              //     } 
              //   } 
              // }
              {
                $addToSet: {
                  ventures: {
                    $each: [
                      {
                        ventureId: ventureId,
                        role: "mentee",
                        status: "awaiting"
                      }
                    ] 
                  }
                }
              }
          );
        }
        // End - add venture to mentee

        // Begin - remove ventures from removed mentors
        await db
          .collection("users")
          .updateMany(
            { email: { $in: emailsOfRemovedMentors } },
            // { $pull: { ventures: { $elemMatch: { ventureId: ventureId } } } }
            { $pull: { ventures: { ventureId: ventureId } } }
        );
        // End - remove ventures from removed mentors

        const venture = await db
          .collection("ventures")
          .findOne({ _id: ventureId });
        res.status(200).json({ success: true, venture: venture });
      }
    }
  } catch (err) {
    res.status(500).json({ err: SERVER_ERR_MSG });
  }
}