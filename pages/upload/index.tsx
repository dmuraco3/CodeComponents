import { NextPage } from "next/types";

import { AuthedPage } from "../../types/AuthedPage";

import Head from "next/head";

import Editor from "@monaco-editor/react";
// import} from "@monaco-editor/react/lib/types"
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/client";

interface userComponent {
  title: string;
  content: string;
  description: string;
  published: boolean;
}

const Upload: AuthedPage = (props) => {
  const [componentData, setComponentData] = useState({
    title: "",
    content: "",
    description: "",
    published: true,
  } as userComponent);

  const [session, loading] = useSession()

  const editorRef: any = useRef();

  function handleEditorDidMount(editor: any, monaco: any) {
    console.log(typeof editor);
    editorRef.current = editor;
  }

  function handleEditorChange() {
    if (editorRef.current) {
      setComponentData({
        ...componentData,
        content: editorRef.current.getValue()
      });
    }
  }

  const router = useRouter();

  const publish = () => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/new`, {
      method: "POST",
      body: JSON.stringify({ ...componentData})
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
    console.log(componentData);
    // router.push("/");
  };

  return (
    <div className="mt-5 flex justify-center flex-wrap">
      <Head>
        <title>Upload</title>
      </Head>
      <div className="flex w-full mx-6">
        <div className="w-1/3">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
            className="flex-initial whitespace-nowrap transition duration-500 ease-in-out transform hover:scale-125  flex items-center text-xl text-grey-800 bg-gray-200 px-6 py-3 rounded-xl ml-4"
          >
            {" "}
            Cancel{" "}
          </button>
        </div>
        <h1 className="w-1/3 flex-initial text-center text-3xl font-bold">
          Upload
        </h1>
        <div className="w-1/3 flex justify-end relative">
          {/* todo: (Dylan Muraco) publish user data to server to api/posts/new */}
          <button
            onClick={(e) => {
              e.preventDefault();
              publish();
            }}
            className="relative z-10 flex-initial transition duration-500 ease-in-out transform hover:scale-125  flex items-center text-xl text-white bg-indigo-600 px-6 py-3 rounded-xl"
          >
            Upload
          </button>
        </div>
      </div>

      <main className="flex-initial w-3/5 mt-8">
        <textarea
          onChange={(e) => {
            setComponentData({ ...componentData, title: e.target.value });
          }}
          value={componentData.title}
          className="resize-none text-gray-600  focus:outline-none w-full text-xl font-semibold"
          placeholder="Give your component a name"
        />
        <div className="h-10 w-full bg-editor"></div>
        <Editor
          height="600px"
          language="javascript"
          theme="vs-dark"
          value={componentData.content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
        <textarea
          onChange={(e) => {
            setComponentData({ ...componentData, description: e.target.value });
          }}
          value={componentData.description}
          className="w-full focus:outline-none mt-8"
          placeholder="Describe what your component does..."
        />
        <button onClick={(e) => {
          e.preventDefault()
          console.log(session)
        }}>click em</button>
      </main>
    </div>
  );
};

export default Upload;

Upload.needsAuth = true;