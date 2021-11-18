import { NextPage } from "next/types";

import { AuthedPage } from "../../types/AuthedPage";

import Head from "next/head";

import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Select, { MultiValue } from 'react-select'
import {GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {Prisma} from '@prisma/client'
import GetTags from "../../helpers/tags/GetTags";

import ImageUploading, {ImageListType} from 'react-images-uploading';

interface userComponent {
  title: string;
  content: string;
  description: string;
  published: boolean;
  tags: MultiValue<{
    label: string;
    value: number;
  }>;
}

export const getServerSideProps: GetServerSideProps<{
  tags: Prisma.PromiseReturnType<typeof GetTags>;
}> = async (context) => {
  const tags = await GetTags();
  return {
    props: {
      tags
    }
  };
};

type tag = {
  id: number;
  name: string;
  imgSrc: string;
};

const Upload: AuthedPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [componentData, setComponentData] = useState({
    title: "",
    content: "",
    description: "",
    published: true,
    tags: [],
  } as userComponent);

  const [session, loading] = useSession()

  const [editorShown, setEditorShown] = useState(false);
  
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };


  const [tagsSelected, setTagsSelected] = useState<MultiValue<{
    label: string;
    value: number;
  }>>()

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
  const options = props.tags.map((tag) =>{ return {label: tag.name, value: tag.id}});
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
        <div
          className="filter drop-shadow-cool bg-white rounded-md"
        >
          {editorShown 
          ? 
          (
            <div>
              <div className="h-10 w-full bg-editor"></div>
              <Editor
                height="600px"
                language="javascript"
                theme="vs-dark"
                value={componentData.content}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
              />
            </div>
          )
          :
          (
            <div>
              <ImageUploading
                multiple={false}
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps
                }) => (
                  // write your building UI
                  <div className="py-20 border-2 rounded-md border-gray-400 border-dotted">
                    <div
                      style={isDragging ? { color: "red" } : undefined}
                      onClick={onImageUpload}
                      {...dragProps}
                      className=""
                    >
                      <h1 className="w-full text-center font-semibold">Drag and Drop an image, or <button className="text-indigo-600" onClick={(e) => {e.preventDefault()}}>Browse</button></h1>
                    </div>
                    {imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image.dataURL} alt="" width="100" />
                        <div className="image-item__btn-wrapper">
                          <button onClick={() => onImageUpdate(index)}>Update</button>
                          <button onClick={() => onImageRemove(index)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUploading>
            </div>
          )
          }

        </div>
        
        <Select onChange={(e) => {
          setComponentData({...componentData, tags: e})
          }} value={tagsSelected} isMulti options={options}/>
      
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

