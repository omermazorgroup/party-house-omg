import axios from "axios";
import baseUrl from "./baseUrl";
import cookie from "js-cookie";
import router from "next/router";
import catchErrors from "../utils/catchErrors";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: { Authorization: cookie.get("token") },
});

export const followUser = async (
  userToFollowId,
  setUserFollowStats,
  setLoadingFollowStats
) => {
  try {
    setLoadingFollowStats(true);
    await Axios.post(`/follow/${userToFollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }],
    }));

    setLoadingFollowStats(false);
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const unfollowUser = async (
  userToUnfollowId,
  setUserFollowStats,
  setLoadingFollowStats
) => {
  try {
    setLoadingFollowStats(true);
    await Axios.put(`/unfollow/${userToUnfollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter(
        (following) => following.user !== userToUnfollowId
      ),
    }));
    setLoadingFollowStats(false);
  } catch (error) {
    alert(catchErrors(error));
  }
};


export const profileUpdate = async (
  profile,
  setLoading,
  setError,
  profilePicUrl
) => {
  try {
    const { bio, facebook, youtube, twitter, instagram } = profile;

    await Axios.post(`/update`, { ...profile, profilePicUrl });
    setLoading(false);
    router.reload();
  } catch (error) {
    setError(catchErrors(error));
    setLoading(false);
  }
};

export const profilePicturesUpdate = async (
  profilePicUrl,
  coverPicUrl,
  setLoading,
  setError
) => {
  try {
    await Axios.post(`/updatepictures`, { profilePicUrl, coverPicUrl });
    setLoading(false);
    router.reload();
  } catch (error) {
    console.log(error);
    setError(catchErrors(error));
    setLoading(false);
  }
};

export const passwordUpdate = async (setSuccess, userPasswords) => {
  try {
    const { currentPassword, newPassword } = userPasswords;

    await Axios.post(`/settings/password`, { currentPassword, newPassword });
    setSuccess(true);
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const toggleMessagePopup = async (
  popupSetting,
  setPopupSetting,
  setSuccess
) => {
  try {
    await Axios.post(`/settings/messagePopup`);
    setPopupSetting(!popupSetting);
    setSuccess(true);
  } catch (error) {
    alert(catchErrors(error));
  }
};
