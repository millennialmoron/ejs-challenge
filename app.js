const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { listen } = require("express/lib/application");
const pword = "rileysahoe17";
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const home =
  "Welcome to my blog! If you've managed to find it, that's awfully impressive. Below you'll find a few posts to read if you're interested.";

const about =
  "To be honest, I've never been any good with keeping up with blogs regularly. I just get busy with other things and forget. I do have another, more public blog on Wordpress that I try to post on weekly. But I designed and built this one as a project for my bootcamp and to be honest I was so proud that I was able to do the whole thing without an hints or even without being told what to do from step to step that I thought I'd go ahead and publish this bad boy to potentially use for my portfolio. That's right, this guy has been built front and back end by ME! And I loved doing it!! Which reminds me, I did a ton of error-testing and debugging, but if you happen to catch some kind of problem somewhere, please oh please let me know! ♡";

const contact =
  "If you like what you see (or have questions/comments/bug reports), feel free to get in touch. The easiest method will be email: millennialmoron87@gmail.com, but I'll be adding my portfolio website here later when I finish and officially start looking for positions.";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://millennialmoron:" +
      pword +
      "@clusterfuck.wmdck.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  );

  const postSchema = new mongoose.Schema({
    title: String,
    body: String,
  });

  const Post = mongoose.model("Post", postSchema);

  app.get("/", function (req, res) {
    Post.find(function (err, postsList) {
      if (err) {
        console.log(err);
      } else {
        res.render("home.ejs", {
          home: home,
          posts: postsList,
        });
      }
    });
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs", {
      about: about,
    });
  });

  app.get("/contact", function (req, res) {
    res.render("contact.ejs", {
      contact: contact,
    });
  });

  app.get("/compose", function (req, res) {
    res.render("compose.ejs");
  });

  app.get("/posts/:id", function (req, res) {
    let idReq = req.params.id;

    Post.findOne({ _id: idReq }, function (err, foundList) {
      if (err) {
        console.log(err);
      } else {
        if (!foundList) {
          console.log(
            "Something bad happened!! Abort the plan! ABORT THE PLAN!"
          );
          res.redirect("/");
        } else {
          res.render("post.ejs", {
            postTitle: foundList.title,
            postBody: foundList.body,
          });
        }
      }
    });
  });

  app.post("/compose", function (req, res) {
    const newPost = new Post();
    newPost.title = req.body.titleText;
    newPost.body = req.body.postText;
    newPost.save(function (err) {
      if (!err) {
        res.redirect("/");
      }
    });
  });
}
app.listen(process.env.PORT, function () {
  console.log("am listenin");
});
