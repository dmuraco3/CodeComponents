import { FaImage, FaJava, FaPlus } from "react-icons/fa";
import { useState } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter'
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Image from 'next/image'
const Editor: React.FC<{files: {language: string, path: string, content: string, active: boolean}[], type: 'read' | 'write'}> = ({files, type}) => {

    const [localFiles, setLocalFiles] = useState(files)

    const [activeFile, setActiveFile] = useState(files.filter(file => file.active)[0])

    return (
        <div className="flex w-full h-[60vh] bg-[#1E1E1E] rounded-2xl">
            <div className="h-full w-2/12 text-white  border-r border-gray-600">
                {/*file navbar*/}
                <div className="h-2/12 flex justify-between px-4 py-4 items-center bg-[#1E1E1E] filter border-b border-gray-600 rounded-tl-2xl">
                    <a>Files</a>
                    {type == "write" && <FaPlus size={18}/>}
                    
                </div>
                <div className="h-full">
                    {localFiles && localFiles.map((file, index) => (
                        <div key={file.path} className={`text-white hover:cursor-pointer ${file.active ? "bg-gray-700" : ""}`} onClick={() => {
                            setLocalFiles(files.map((file, i) => {
                                return {
                                    ...file,
                                    ...(index == i ? {active: true} : {active: false})
                                }
                            }))
                            setActiveFile({...file, active: true})
                        }}>
                            {file.language === 'javascript' ? 
                                <div className="flex px-4 py-4 items-center">
                                    <a><FaJava size={24}/></a>
                                    <a className="text-sm ml-2">{file.path}</a>
                                </div>
                                :
                                file.language === 'jpg' && <div className="flex px-4 py-4 items-center">
                                    <a><FaImage size={24}/></a>
                                    <a className="text-sm ml-2">{file.path}</a>
                                </div>
                            }
                        </div>
                    ))}

                </div>
            </div>
            <div className="w-10/12">
                {activeFile.language !== "jpg" ? (
                <SyntaxHighlighter language="javascript" style={dracula} className="w-full h-full mb-auto rounded-r-2xl" > 
                    {files[0].content}
                </SyntaxHighlighter>

                ) : (
                    <div className="relative w-full h-full ">

                        <Image src={activeFile.content}  layout="fill" className="overflow-hidden rounded-r-2xl"/>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Editor;