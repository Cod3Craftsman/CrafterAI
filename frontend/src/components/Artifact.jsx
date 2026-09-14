
import { useSelector } from "react-redux"
import { Check, Code2, CopyIcon, Eye, PanelLeftClose, PanelRightClose, PanelRightOpen } from "lucide-react"
import { useState } from "react";
import { easeInOut, motion } from "motion/react"
import Editor from '@monaco-editor/react';




function Artifact() {

  const { artifacts } = useSelector(state => state.message);
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState("code")
  const [activeFile, setActiveFile] = useState(0)
  const [copyCode, setCopyCode] = useState(false)




  if (artifacts.length === 0) return null;



  const fileContent = artifacts[0]?.files[activeFile]
  const htmlFile = artifacts[0]?.files?.find(f => f?.name === "index.html");
  const cssFile = artifacts[0]?.files?.find(f => f?.name === "style.css");
  const jsFile = artifacts[0]?.files?.find(f => f?.name === "script.js");

  const canPreview = Boolean(htmlFile)

  const previewDoc = htmlFile?.content
    ?.replace(
      "</head>",
      `<style>${cssFile?.content || ""}</style></head>`
    )
    ?.replace(
      "</body>",
      `<script>${jsFile?.content || ""}</script></body>`
    );




  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";

    if (name.endsWith(".vue")) return "vue";
    if (name.endsWith(".svelte")) return "svelte";
    if (name.endsWith(".astro")) return "astro";

    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".c")) return "c";
    if (name.endsWith(".cs")) return "csharp";
    if (name.endsWith(".go")) return "go";
    if (name.endsWith(".rs")) return "rust";
    if (name.endsWith(".php")) return "php";
    if (name.endsWith(".rb")) return "ruby";
    if (name.endsWith(".swift")) return "swift";
    if (name.endsWith(".kt")) return "kotlin";

    return "plaintext";
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(fileContent?.content || "");
    setCopyCode(true);

    setTimeout(() => {
      setCopyCode(false);
    }, 5000);
  };



  return (
    <motion.div
      initial={{ opacity: 0, width: 400 }}   // from
      animate={{ opacity: 1, width: collapsed ? 48 : 400 }}  // to
      transition={{ duration: 0.25, ease: easeInOut }}        // time , slow, fast


      className='hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0'>

      {
        !collapsed ?
          <div className='flex flex-col h-full bg-[#0d0f14]'>

            <div className='h-14  px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0'>
              <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0' onClick={() => setCollapsed(true)}>
                <PanelRightClose size={20} />
              </button>
              <div className='flex items-center gap-2 flex-1 min-w-0'>
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0 transition-colors duration-150 border-none cursor-pointer">
                  <Code2 className="text-indigo-400" size={12} />
                </div>

                <div className="text-[13px] font-medium text-slate-200 truncate">
                  {artifacts[0]?.title?.charAt(0).toUpperCase() +
                    artifacts[0]?.title?.slice(1)}
                </div>

              </div>


              {/* copy div */}

              {
                tab === "code" && <div className="flex items-center gap-1 shrink-0">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer" onClick={handleCopyCode} disabled={copyCode}>
                    {copyCode ? <Check size={15} /> : <CopyIcon size={15} />}
                  </button>
                </div>
              }




              {canPreview && <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
                <button
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors duration-150
                   ${tab === "code"
                      ? "text-indigo-300 bg-indigo-500/10"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]"
                    }`}
                >
                  <Code2 size={13} />
                  Code
                </button>

                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors duration-150
                  ${tab === "preview"
                      ? "text-indigo-300 bg-indigo-500/10"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]"
                    }`}
                >
                  <Eye size={13} />
                  Preview
                </button>
              </div>
              }
            </div>


            {/* ACTUAL CODE */}

            {tab === "code" &&

              <div className="h-auto flex border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
                {artifacts[0]?.files?.map((f, index) => (
                  <button
                    key={f.name}
                    onClick={() => setActiveFile(index)}

                    className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.06] relative cursor-pointer bg-transparent ${activeFile === index
                      ? index === 0
                        ? "text-orange-400"
                        : index === 1
                          ? "text-blue-400"
                          : "text-yellow-400"
                      : "text-slate-500 hover:text-slate-300"
                      }`}
                  >
                    {f.name}

                    {activeFile === index && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full ${index === 0
                          ? "bg-orange-400"
                          : index === 1
                            ? "bg-blue-400"
                            : "bg-yellow-400"
                          }`}
                      />
                    )}
                  </button>
                ))}

              </div>

            }


            {/* PREVIEW */}
            <div className="flex-1 overflow-hidden">
              {(tab === "preview" && canPreview) ? <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}

                className="w-full h-full"
              >
                <iframe
                  title="preview"
                  srcDoc={previewDoc}
                  className="w-full h-full bg-white border-0"
                  sandbox="allow-scripts"
                />
              </motion.div>

                // eidtor
                :

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >

                  <Editor
                    theme="vs-dark"
                    language={detectLanguage(fileContent?.name)}
                    value={fileContent?.content}
                    options={{
                      readOnly: true,
                      minimap: { enabled: true },
                      fontSize: 13,
                      wordWrap: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 16 },
                      lineNumbers: "on",
                      renderLineHighlight: "none"
                    }}
                  />

                </motion.div>

              }


            </div>

          </div>




          :
          // collapse true
          <div className='hidden lg:flex h-full border-l border-white/[0.06] bg-[#0d0f14] flex-col items-center py-4 gap-3 shrink-0'>


            <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0' onClick={() => setCollapsed(false)}>
              <PanelRightOpen size={20} />
            </button>
            <div className='flex items-center gap-2 flex-1 min-w-0'>


              <div className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
                {artifacts[0]?.title}
              </div>

            </div>
          </div>




      }



    </motion.div>
  )
}

export default Artifact