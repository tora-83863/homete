import imageCompression from 'browser-image-compression';
import React from 'react';
import { AiOutlinePicture } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';

import { GoogleGenerativeAI } from '@google/generative-ai';

import * as style from './style';

interface ChatMessage {
  role: string;
  content?: string;
  image?: string;
}

const ROLE = {
  USER: "user",
  SYSTEM: "system",
  LOADING: "loading",
};

const ERROR_MESSAGE =
  "エラーが発生しました。少し待ってからもう一度試してみてください。";

const MainPage = () => {
  // URLパラメータ取得
  const search = useLocation().search;
  const urlSearchParams = new URLSearchParams(search);
  const apiKey: string = urlSearchParams.get("apiKey") ?? "";

  // インスタンス生成
  const genAI = new GoogleGenerativeAI(apiKey);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = React.useState<string>("");
  const [inputFile, setInputFile] = React.useState<File | null>(null);
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (inputFile !== null && inputFile !== undefined) {
      sendMessage();
    }
  }, [inputFile]);

  const sendMessage = async () => {
    // テキスト or 画像の入力チェック
    if (isLoading || (inputText.length === 0 && inputFile === null)) {
      return;
    }

    // ユーザー入力チャットを履歴に追加
    const userMessage: ChatMessage = { role: ROLE.USER };
    if (inputFile !== null) {
      userMessage.image = window.URL.createObjectURL(inputFile);
    } else if (inputText !== null && inputText.length > 0) {
      userMessage.content = inputText;
    }
    const updatedChatHistory = [...chatHistory, userMessage];

    // ローディングチャットを履歴に追加して画面表示
    setChatHistory([...updatedChatHistory, { role: ROLE.LOADING }]);
    setIsLoading(true);

    // システム返答チャット
    let systemMessage: ChatMessage = { role: ROLE.SYSTEM };
    let result;
    try {
      if (inputFile === null) {
        // テキスト入力の場合
        setInputText("");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        result = await model.generateContent(`次の内容を褒めてください。「${inputText}」`,);
        const response = await result.response;
        systemMessage.content = response.text();
      } else {
        // 画像入力の場合
        setInputFile(null);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const imageParts = await fileToGenerativePart(inputFile);
        if (imageParts !== undefined) {
          result = await model.generateContent([
            "次の画像を褒めてください。",
            imageParts,
          ]);
          const response = await result.response;
          systemMessage.content = response.text();
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      systemMessage.content = ERROR_MESSAGE;
    } finally {
      // システムからの返答を画面表示
      setChatHistory([...updatedChatHistory, systemMessage]);
      setIsLoading(false);
    }
  };

  // 画像データをbase64形式に変換し、APIリクエストに含められるPartを生成する
  async function fileToGenerativePart(file: File) {
    // 画像を1MBまで圧縮する
    const compressFile = await imageCompression(file, { maxSizeMB: 1 });

    const reader = new FileReader();
    reader.readAsDataURL(compressFile);
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(
          reader.result && typeof reader.result === "string"
            ? reader.result.split(",")[1]
            : ""
        );
      reader.readAsDataURL(compressFile);
    });
    return {
      inlineData: {
        data: (await base64EncodedDataPromise) as string,
        mimeType: file.type,
      },
    };
  }

  // 画面に表示するチャットコンポーネントを生成する
  const makeChatMessage = (message: ChatMessage) => {
    const commonStyle = {
      marginBlockStart: "0.25rem",
      marginBlockEnd: "0.25rem",
    };
    const listStyle = {
      ...commonStyle,
      paddingLeft: "1.0rem",
      listStyle: "none",
    };
    if (message.role === ROLE.SYSTEM) {
      return (
        <ReactMarkdown
          components={{
            p: ({ children }) => <p style={commonStyle}>{children}</p>,
            ul: ({ children }) => <ul style={listStyle}>{children}</ul>,
            ol: ({ children }) => <ol style={listStyle}>{children}</ol>,
          }}
          children={message.content}
        />
      );
    }
    return (
      <>
        {message.content !== null && message.content !== undefined ? (
          <div>{message.content}</div>
        ) : message.image !== null && message.image !== undefined ? (
          <img src={message.image} className={style.image} alt="" />
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
      <div className={style.chatContainer}>
        <div className={style.chatArea}>
          {chatHistory.map((chat, index) =>
            chat.role === ROLE.LOADING ? (
              <SyncLoader
                color={style.colorCode.system}
                cssOverride={{
                  marginTop: 25,
                }}
                margin={5}
                size={10}
                speedMultiplier={1}
              />
            ) : (
              <div
                key={index}
                className={
                  chat.role === ROLE.USER ? style.fukidasiUser :
                  chat.role === ROLE.SYSTEM ? style.fukidasiSystem :
                  ""
                }
                children={makeChatMessage(chat)}
              />
            )
          )}
        </div>
        <div className={style.inputContainer}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={style.input}
            onKeyDown={(e) => {
              if (!e.nativeEvent.isComposing && e.key === "Enter") {
                sendMessage();
              }
            }}
            disabled={isLoading}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden={true}
            onChange={async (e) => {
              const fileList = e.target.files;
              if (fileList !== null && fileList.length > 0) {
                setInputFile(fileList[0]);
                e.target.value = "";
              }
            }}
          />
          <FiSend
            color={style.colorCode.accent}
            size={30}
            onClick={sendMessage}
            style={{ paddingRight: 10, paddingLeft: 10 }}
          />
          <AiOutlinePicture
            color={style.colorCode.accent}
            size={35}
            onClick={() => {
              if (!isLoading) {
                fileInputRef.current?.click();
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MainPage;
