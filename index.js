import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
//import { title } from "process";

const app = express();

const cssPublic = path.resolve("public");

app.use(express.static(cssPublic));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const dbName = "nodeTodo";
const collectionName = "todo";
const url ="mongodb+srv://bp146498_db_user:Deepak7879@cluster0.yqahptl.mongodb.net/?appName=Cluster0"
const client = new MongoClient(url);

const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};

app.get("/", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find().toArray();

  resp.render("list", { result: result });
});
app.get("/add", (req, resp) => {
  resp.render("add");
});
app.post("/update", (req, resp) => {
  resp.redirect("/");
});

app.post("/add", async (req, resp) => {
  const db = await connection();
  const collect = db.collection(collectionName);

  const result = collect.insertOne(req.body);

  if (result) {
    resp.redirect("/");
  } else {
    resp.redirect("/add");
  }
});



app.get("/delete/:id", async (req, resp) => {
  const db = await connection();
  const collect = db.collection(collectionName);

  const result = collect.deleteOne({_id:new ObjectId(req.params.id)});

  if (result) {
    resp.redirect("/");
  } else {
    resp.redirect("some error");
  }
});



app.get("/update/:id", async (req, resp) => {
  const db = await connection();
  const collect = db.collection(collectionName);

  const result = await collect.findOne({_id:new ObjectId(req.params.id)});

  if (result) {
    resp.render("update",{result:result});
  } else {
    resp.redirect("some error");
  }
  console.log(result)

});


app.post("/update/:id", async (req, resp) => {
  const db = await connection();
  const collect = db.collection(collectionName);

  const filter ={_id:new ObjectId(req.params.id)}
  const data ={$set:{title:req.body.title,discription:req.body.discription}}
  const result = await collect.updateOne(filter,data);

  if (result) {
    resp.redirect("/");
  } else {
    resp.redirect("some error");
  }
  console.log(result)

});

app.listen(3200);
