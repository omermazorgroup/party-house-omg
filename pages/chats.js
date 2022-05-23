import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import baseUrl from "../utils/baseUrl";
import io from "socket.io-client";
import Sidebar from "../components/Sidebar";
import ChatSearch from "../components/Chat/ChatSearch";
import { SearchIcon } from "@heroicons/react/outline";
import styled from "styled-components";
import calculateTime from "../utils/calculateTime";
import Chat from "../components/Chat/Chat";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { getUserInfo } from "../utils/messageActions";
import Loader from "react-loader-spinner";
import cookie from "js-cookie";
import { Facebook } from "react-content-loader";

function ChatsPage({ user, chatsData }) {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();
  const socket = useRef();
  const [texts, setTexts] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [newText, setNewText] = useState("");
  const [chatUserData, setChatUserData] = useState({
    name: "",
    profilePicUrl: "",
  });

  const openChatId = useRef("");
  const [showChatSearch, setShowChatSearch] = useState(false);


  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {

      socket.current.emit("join", { userId: user._id });



      socket.current.on("connectedUsers", ({ users }) => {
        setConnectedUsers(users);
      });
    }

    console.log(router.pathname);
    if (
      chats &&
      chats.length > 0 &&
      !router.query.chat &&
      router.pathname === "/chats"
    ) {
      if (!cookie.get("token")) {
        return;
      }
      router.push(`/chats?chat=${chats[0].textsWith}`, undefined, {
        shallow: true,
      });

    }


  }, []);


  useEffect(() => {
    const loadTexts = () => {
      socket.current.emit("loadTexts", {
        userId: user._id,
        textsWith: router.query.chat,
      });

      socket.current.on("textsLoaded", ({ chat, textsWithDetails }) => {

        if (textsWithDetails) {
          setTexts([]);
          setChatUserData({
            name: textsWithDetails.name,
            profilePicUrl: textsWithDetails.profilePicUrl,
          });
          openChatId.current = router.query.chat;
        } else {
          setTexts(chat.texts);
          scrollToBottom();
          setChatUserData({
            name: chat.textsWith.name,
            profilePicUrl: chat.textsWith.profilePicUrl,
          });
          openChatId.current = chat.textsWith._id;
        }
      });
    };

    if (socket.current && router.query.chat) {
      loadTexts();
    }
  }, [router.query.chat]);

  const sendText = (e, text) => {
    e.preventDefault();
    if (socket.current) {
      socket.current.emit("sendNewText", {
        userId: user._id,
        userToTextId: openChatId.current,
        text,
      });
    }
    setNewText("");
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("textSent", ({ newText }) => {

        if (newText.receiver === openChatId.current) {
          setTexts((prev) => [...prev, newText]);


          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.textsWith === newText.receiver
            );
            previousChat.lastText = newText.text;
            previousChat.date = newText.date;

            return [...prev];
          });
        }
      });

      socket.current.on("newTextReceived", async ({ newText, userDetails }) => {

        if (newText.sender === openChatId.current) {
          setTexts((prev) => [...prev, newText]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.textsWith === newText.sender
            );
            previousChat.lastText = newText.text;
            previousChat.date = newText.date;
            return [...prev];
          });
        } else {
          const ifPreviouslyTexted =
            chats.filter((chat) => chat.textsWith === newText.sender).length >
            0;

          if (ifPreviouslyTexted) {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.textsWith === newText.sender
              );
              previousChat.lastText = newText.text;
              previousChat.date = newText.date;
              return [...prev];
            });
          } else {


            const newChat = {
              textsWith: newText.sender,
              name: userDetails.name,
              profilePicUrl: userDetails.profilePicUrl,
              lastText: newText.text,
              date: newText.date,
            };
            setChats((prev) => [newChat, ...prev]);
          }
        }
      });
    }
  }, []);

  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    texts.length > 0 && scrollToBottom();
  }, [texts]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        await axios.post(
          `${baseUrl}/api/chats`,
          {},
          {
            headers: { Authorization: cookie.get("token") },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    markMessagesAsRead();
  }, []);

  return (
    <div className="bg-black">
      <Header user={user} />
      <main className="flex" style={{ margin: "0.5rem" }}>
        <Sidebar user={user} maxWidth={"250px"} />
        <div className="md:flex flex-grow mx-auto h-full w-full max-w-2xl lg:max-w-[65rem] xl:max-w-[70.5rem] bg-white  rounded-lg">
          <div
            style={{
              borderRight: "1px solid lightgrey",
              fontFamily: "Inter",
            }}
            className="lg:min-w-[27rem] relative pt-4"
          >
            <Title>Chats</Title>
            <div
              onClick={() => setShowChatSearch(true)}
              className="flex items-center rounded-full bg-gray-100 p-2  m-4 h-12"
            >
              <SearchIcon className="h-5 text-gray-600 px-1.5 md:px-0 cursor-pointer" />
              <input
                className="ml-2 bg-transparent outline-none placeholder-gray-500 w-full font-thin hidden md:flex md:items-center flex-shrink"
                type="text"
                placeholder="Search users"
              />
            </div>

            {showChatSearch && (
              <ChatSearch
                setShowChatSearch={setShowChatSearch}
                chats={chats}
                setChats={setChats}
              />
            )}

            <div className="mt-4 pl-4 pr-4 overflow-y-auto" style={{ borderTop: "1px solid #efefef",  height: "calc(100vh - 20.5rem)"}}>
              <>
                {chats && chats.length > 0 ? (
                  chats.map((chat) => (

                    <ChatDiv
                      key={chat.textsWith}
                      onClick={() =>
                        router.push(`/chats?chat=${chat.textsWith}`)
                      }
                    >
                      <div className="relative">
                        <UserImage src={chat.profilePicUrl} alt="userimg" />
                        {connectedUsers.length > 0 &&
                        connectedUsers.filter(
                          (user) => user.userId === chat.textsWith
                        ).length > 0 ? (
                          <FiberManualRecordIcon
                            style={{
                              color: "#55d01d",
                              fontSize: "1.85rem",
                              position: "absolute",
                              bottom: "-.5rem",
                              right: "0rem",
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="ml-1">
                        <Name>{chat.name}</Name>
                        <TextPreview>
                          {chat.lastText && chat.lastText.length > 30
                            ? `${chat.lastText.substring(0, 30)}...`
                            : chat.lastText}
                        </TextPreview>
                      </div>
                      {chat.date && (
                        <Date>{calculateTime(chat.date, true)}</Date>
                      )}
                    </ChatDiv>
                  ))
                ) : (
                  <>
                    <p className="p-5 text-gray-500">
                      Start a chat with someone!
                    </p>
                  </>
                )}
              </>
            </div>
          </div>
          {router.query.chat && (
            <div
              style={{
                flex: "1",
                fontFamily: "Inter"
              }}
            >
              {chatUserData && chatUserData.profilePicUrl ? (
                <ChatHeaderDiv>

                  <UserImage src={chatUserData.profilePicUrl} alt="userimg" />
                  <div>
                    <ChatName>{chatUserData.name}</ChatName>

                    {connectedUsers.length > 0 &&
                      connectedUsers.filter(
                        (user) => user.userId === openChatId.current
                      ).length > 0 && <LastActive>{"Online"}</LastActive>}
                  </div>
                </ChatHeaderDiv>
              ) : (
                <div
                  className="max-w-[28rem]"
                  style={{ padding: "1rem 0.9rem" }}
                >
                  <Facebook />
                </div>
              )}

              <div
                className=" flex flex-col justify-between"
                style={{
                  height: "calc(100vh - 10.5rem)",
                }}
              >
                <div
                  className="mt-3 pl-4 pr-4 overflow-y-auto"
                  style={{ scrollbarWidth: "thin" }}
                >
                  <>
                    {" "}
                    {texts.length > 0 ? (
                      texts.map((text, i) => (
                        <Chat
                          key={i}
                          user={user}
                          text={text}
                          setTexts={setTexts}
                          textsWith={openChatId.current}
                        />
                      ))
                    ) : (
                      <div></div>
                    )}
                    <EndOfMessage ref={endOfMessagesRef} />
                  </>
                </div>
                <div
                  style={{
                    borderTop: "1px solid #efefef",
                    borderBottom: "1px solid #efefef",
                  }}
                >
                  <form

                    className="flex items-center rounded-full bg-gray-100 p-4 m-4 max-h-12"
                  >
                    <input
                      className="bg-transparent outline-none placeholder-gray-500 w-full font-thin md:flex md:items-center flex-shrink"
                      type="text"
                      value={newText}
                      onChange={(e) => {
                        setNewText(e.target.value);
                      }}
                      placeholder="Send a new text..."
                    />{" "}
                    <button
                      hidden
                      disabled={!newText}
                      type="submit"
                      onClick={(e) => sendText(e, newText)}
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

ChatsPage.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });
    return { chatsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default ChatsPage;

const Title = styled.p`
  user-select: none;
  font-size: 1.65rem;
  font-weight: 600;
  font-family: Inter;
  margin: 1rem;
`;

const UserImage = styled.img`
  height: 3.8rem;
  width: 3.8rem;
  border-radius: 50%;
  object-fit: cover;
`;

const ChatDiv = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 0.3rem;
  border-bottom: 1px solid #efefef;
  font-family: Inter;
  padding: 1rem 0.9rem;
  align-items: flex-start;
  column-gap: 0.6rem;
  :hover {
    background-color: rgba(243, 244, 246);
  }
`;

const ChatHeaderDiv = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 0.3rem;
  border-bottom: 1px solid #efefef;
  font-family: Inter;
  padding: 1rem 0.9rem;
  align-items: center;
  column-gap: 0.6rem;
`;
const Name = styled.p`
  user-select: none;
  font-weight: 600;
  font-size: 1.08rem;
  font-family: Inter;
`;

const ChatName = styled.p`
  user-select: none;
  font-weight: 600;
  font-size: 1.2rem;
  font-family: Inter;
`;

const TextPreview = styled.p`
  font-family: Inter;
  margin-top: -0.95rem;
`;

const Date = styled.p`
  font-family: Inter;
  margin-left: auto;
`;

const LastActive = styled.p`
  user-select: none;
  font-size: 0.9rem;
  color: rgba(107, 114, 128);
  margin-top: -1.1rem;
`;

const TextInputDiv = styled.div`
  padding: 1rem;
`;

const EndOfMessage = styled.div`
  margin-bottom: 30px;
`;
