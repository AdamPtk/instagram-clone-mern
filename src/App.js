import { useEffect, useState } from "react";
import "./App.css";
import { db, auth } from "./firebase";
import Post from "./Post";
import Modals from "./Modals";
import { Button } from "@mui/material";
import ImageUpload from "./ImageUpload";
import axios from "./axios";
import Pusher from "pusher-js";

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user, username]);

  useEffect(() => {
    const pusher = new Pusher("bee4603eed2b60741c79", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("posts");
    channel.bind("inserted", (data) => {
      console.log("data received:", data);
      fetchPosts();
    });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () =>
    await axios.get("/sync").then((res) => {
      console.log(res);
      setPosts(res.data);
    });

  return (
    <div className="app">
      <Modals
        open={open}
        setOpen={setOpen}
        openSignIn={openSignIn}
        setOpenSignIn={setOpenSignIn}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      <div className="app_header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app_headerImage"
        />
        <div className="app_loginContainer">
          {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <>
              <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </>
          )}
        </div>
      </div>
      <div className="app_posts">
        {posts.map((post) => (
          <Post
            key={post._id}
            postId={post._id}
            user={user}
            username={post.user}
            caption={post.caption}
            imageUrl={post.image}
            // avatarUrl={post.avatarUrl}
          />
        ))}
      </div>
      <ImageUpload user={user} username={user?.multiFactor.user.displayName} />
    </div>
  );
}

export default App;
