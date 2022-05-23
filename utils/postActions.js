import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";


const Axios = axios.create({
  baseURL: `${baseUrl}/api/posts`,
  headers: { Authorization: cookie.get("token") },
});

export const submitNewPost = async (
  text,
  location,
  picUrl,
  setPosts,
  setNewPost,
  setError
) => {
  try {

    const res = await Axios.post("/", { text, location, picUrl });


    setPosts((prev) => [res.data, ...prev]);
    setNewPost({ postText: "", location: "" });
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};

export const submitNewEvent = async (
  name,
  text,
  picUrl,
  date,
  isEvent,
  setPosts,
  setNewPost,
  setError
) => {
  try {
    const res = await Axios.post("/", {name, text, picUrl, date, isEvent});

    setPosts((prev) => [res.data, ...prev]);
    setNewPost({ postText: "", location: "" });
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};

export const deletePost = async (postId, setPosts, notify) => {
  try {
    await Axios.delete(`/${postId}`);

    setPosts((prev) => prev.filter((post) => post._id !== postId));
    notify();
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if (like) {
      await Axios.post(`/like/${postId}`);
      setLikes((prev) => [...prev, { user: userId }]);
    } else if (!like) {
      await Axios.put(`/unlike/${postId}`);
      setLikes((prev) => prev.filter((like) => like.user !== userId));
    }
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const postComment = async (postId, user, text, setComments, setText) => {
  try {
    const res = await Axios.post(`/comment/${postId}`, { text });

    const newComment = {
      _id: res.data,
      user,
      text,
      date: Date.now(),
    };

    setComments((prev) => [newComment, ...prev]);

    setText("");
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const deleteComment = async (
  postId,
  commentId,
  setComments,
  notifyCommentDelete
) => {
  try {
    await Axios.delete(`/${postId}/${commentId}`);
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    notifyCommentDelete();
  } catch (error) {
    alert(catchErrors(error));
  }
};
