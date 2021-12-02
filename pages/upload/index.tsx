import { NextPage } from "next/types";

import { AuthedPage } from "../../types/AuthedPage";

import Head from "next/head";

import Editor from "@monaco-editor/react";
import { Component, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Select, { MultiValue } from 'react-select'
import {GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {Prisma} from '@prisma/client'
import GetTags from "../../helpers/tags/GetTags";

import ImageUploading, {ImageListType} from 'react-images-uploading';
import Cropper from 'react-cropper'
import { FaTimes } from "react-icons/fa";

type userComponent = {
  title: string;
  image: string;
  content: string;
  description: string;
  published: boolean;
  tags: MultiValue<{
    label: string;
    value: number;
  }>
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
  const [componentData, setComponentData] = useState<userComponent>({
    title: "",
    image: "",
    content: "",
    description: "",
    published: true,
    tags: [],
  } as userComponent);

  const [data, setData] = useState()

  const [session, loading] = useSession()

  const [editorShown, setEditorShown] = useState(false);
  
  const [images, setImages] = useState([]);
  const [croppedImage, setCroppedImage] = useState<string | undefined>()
  const maxNumber = 1;
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setComponentData({...componentData, image: cropper.getCroppedCanvas().toDataURL()})
  };

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    setImages(imageList as never[]);
  };


  const [tagsSelected, setTagsSelected] = useState<MultiValue<{
    label: string;
    value: number;
  }>>()

  const editorRef: any = useRef();

  function handleEditorDidMount(editor: any, monaco: any) {
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
      body: JSON.stringify(componentData)
    })
      .then((res) => res.json())
      .then((json) => {
        if(json.message == "Post created") {
          router.push("/");
          
        }
      });
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
              <>
                {imageList.length === 0 ?
                <div className="py-20 border-2 rounded-tl-md rounded-tr-md border-gray-400 border-dotted">
                  <div
                    style={isDragging ? { color: "red" } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                    className=""
                  >
                    <h1 className="w-full text-center font-semibold">Drag and Drop an image, or <button className="text-indigo-600" onClick={(e) => {e.preventDefault()}}>Browse</button></h1>
                  </div>
                </div>
                :
                <div className="relative">
                  <FaTimes 
                    size={40}
                    className="absolute top-0 right-0 z-30 hover:cursor-pointer text-red-500 filter drop-shadow-cool transform hover:scale-125 transition-transform duration-300 ease-in-out"
                    onClick={() => {
                      onImageRemove(0)
                    }}
                  />
                  <Cropper
                    src={imageList[0].dataURL}
                    style={{ height: 400, width: "100%" }}
                    // Cropper.js options
                    initialAspectRatio={9 / 9}
                    cropBoxResizable={false}
                    guides={false}
                    crop={onCrop}
                    ref={cropperRef}
                  />
                </div>  
              }
                
              
              </>
            )}
          </ImageUploading>
          <Editor
            height="600px"
            language="javascript"
            theme="vs-dark"
            value={componentData.content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        </div>
        

        <div className="mt-4">
          <Select onChange={(e) => {
            setComponentData({...componentData, tags: e})
            }} value={tagsSelected} isMulti options={options} placeholder="Select Tags"/>

        </div>
      
        <textarea
          onChange={(e) => {
            setComponentData({ ...componentData, description: e.target.value });
          }}
          value={componentData.description}
          className="w-full focus:outline-none mt-8"
          placeholder="Describe what your component does..."
        />

      </main>
    </div>
  );
};

export default Upload;

Upload.needsAuth = true;

