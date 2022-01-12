import { FaImage, FaJava, FaPlus } from "react-icons/fa";
import { useState } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter'
import vsDark from './highlight'
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
const Editor: React.FC<{files: {language: string, path: string, content: string}[], type: 'read' | 'write'}> = ({files, type}) => {

    const [tabs, setTabs] = useState<{language: string, path: string, content: string}[]>([{...files[0]}])

    return (
        <div className="flex w-full h-[60vh] bg-[#1E1E1E] rounded-2xl">
            <div className="h-full w-2/12 text-white  border-r border-gray-600">
                {/*file navbar*/}
                <div className="h-2/12 flex justify-between px-4 py-4 items-center bg-[#1E1E1E] filter border-b border-gray-600 rounded-tl-2xl">
                    <a>Files</a>
                    <FaPlus size={18}/>
                </div>
                <div className="h-full">
                    {files.map((file, index) => (
                        <div key={file.path} className="text-white ">
                            {file.language === 'js' ? 
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
            <div className="w-10/12 h-[54vh]">
                <div className="h-2/12 w-full bg-[#1E1E1E] filter border-b border-gray-600 rounded-tr-2xl text-white">
                    {tabs.map((file, index) => (
                        <div key={file.path} className="border-r border-[#8f8f8f] flex w-fit">
                             {file.language === 'js' ? 
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
                <SyntaxHighlighter language="javascript" style={dracula} className="w-full h-full mb-auto rounded-br-2xl" > 
                    {files[0].content}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

export default Editor;