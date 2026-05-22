import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import UseChat from "../hooks/usechat";
import ReactMarkdown from "react-markdown";
import { markMessageAnimated } from "../services/chat.slice";

const AnimatedResponse = ({ content, animate, onComplete }) => {
  const [visibleContent, setVisibleContent] = useState(animate ? "" : content);

  useEffect(() => {
    if (!animate) {
      setVisibleContent(content);
      onComplete?.();
      return;
    }

    const words = content.match(/\S+\s*/g) || [];
    let index = 0;

    setVisibleContent("");

    const interval = setInterval(() => {
      setVisibleContent(words.slice(0, index + 1).join(""));
      index++;

      if (index >= words.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 45);

    return () => clearInterval(interval);
  }, [content, animate]);

  return (
    <div className={animate ? "ai-response-typing" : ""}>
      <ReactMarkdown>{visibleContent}</ReactMarkdown>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentChatId = useSelector((state) => state.chat?.currentChatId);
  const chats = useSelector((state) => state.chat?.chats);
  const isLoading = useSelector((state) => state.chat?.loading);
  const {
    handleCreateNewChat,
    handleGetChats,
    handleDeleteChat,
    handlegetMessages,
  } = UseChat();

  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    handleGetChats();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage(e);
    }
  };

  const handleSubmitMessage = (e) => {
    if (e) e.preventDefault();

    const trimmedMessage = input.trim();
    if (!trimmedMessage) return;

    handleCreateNewChat({
      message: trimmedMessage,
      chatId: currentChatId,
    });

    setInput("");
  };

  return (
    <div className="flex h-screen bg-[#000] text-gray-200 font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex w-[260px] bg-[#111] border-r border-gray-800 flex-col ">
        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={handlegetMessages}
            className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#2b2b2b] text-sm text-gray-200"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-4 h-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2  messages-container">
          <p className="text-xs text-gray-500 px-2">Today</p>

          {Object.values(chats || {}).map((chat) => (
            <div key={chat.id} className="flex items-center gap-2 group">
              <button
                onClick={() => handlegetMessages(chats, chat.id)}
                className="flex-1 text-left p-2 rounded-lg hover:bg-[#212121] text-sm text-gray-300"
              >
                {chat.title}
              </button>

              <button
                onClick={() => handleDeleteChat(chat.id)}
                className="opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* User */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#212121]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <span>{user?.username || "User"}</span>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className=" flex-1 flex flex-col relative">
        {/* Empty State */}
        {!chats[currentChatId]?.messages?.length ? (
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-2xl font-semibold text-gray-300">
              How can I help you today?
            </h2>
          </div>
        ) : (
          <div className=" flex-1 overflow-y-auto pb-40 px-4 md:px-8 max-w-[48rem] mx-auto w-full space-y-6 mt-4  messages-container">
            {chats[currentChatId]?.messages?.map((msg, idx) => {
              const isUser = msg.role === "user";
              const shouldAnimate = !isUser && Boolean(msg.animate);

              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] ${
                      isUser
                        ? "bg-[#2f2f2f] px-5 py-3 rounded-3xl rounded-br-md"
                        : "py-2 message-fade-in"
                    }`}
                  >
                    {isUser ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <AnimatedResponse
                        content={msg.content}
                        animate={shouldAnimate}
                        onComplete={() =>
                          dispatch(
                            markMessageAnimated({
                              chatId: currentChatId,
                              messageIndex: idx,
                            }),
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Input */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#212121]to-transparent pt-10 pb-6 px-4 md:px-8">
          <form
            onSubmit={handleSubmitMessage}
            className="max-w-[48rem] mx-auto flex bg-[#2f2f2f] rounded-[24px] items-center justify-center"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Perplexity..."
              rows="1"
              className="flex-1 bg-transparent px-4 py-3 resize-none outline-none text-white"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className=" w-10 h-10 rounded-full bg-white text-black disabled:opacity-50"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
