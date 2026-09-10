import React, { useState } from "react"
import remarkGfm from "remark-gfm"
import Markdown from "react-markdown"
import { ExternalLink, X } from "lucide-react"

function MessageBubble({ role, content, images }) {
  const isUser = role == "user"
  const [lightBox, setLightBox] = useState(null)

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all duration-200 ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white rounded-tr-md shadow-indigo-500/10"
            : "bg-white/[0.045] backdrop-blur-xl border border-white/[0.08] text-slate-200 rounded-tl-md shadow-black/10 hover:bg-white/[0.055]"
        }`}
      >

        {/* Images */}
        {images?.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 mb-3 max-w-[480px]">
            {images.map((img, i) => (
              <img
                onClick={() => setLightBox(img)}
                key={i}
                src={img}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-full aspect-[1.45/1] rounded-xl object-cover border border-white/[0.12] cursor-zoom-in hover:scale-[1.02] hover:opacity-95 transition-all duration-200 shadow-md shadow-black/10"
              />
            ))}
          </div>
        )}

        {/* Markdown */}
        <div
          className={`prose prose-sm max-w-none ${
            isUser
              ? "prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-code:text-white"
              : "prose-invert prose-p:text-slate-200 prose-headings:text-slate-100 prose-strong:text-white prose-code:text-indigo-300"
          }`}
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{

              /* H1 */
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold tracking-tight text-white mb-4 mt-2">
                  {children}
                </h1>
              ),

              /* H2 */
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-slate-100 mt-6 mb-3">
                  {children}
                </h2>
              ),

              /* H3 */
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-slate-100 mt-5 mb-2">
                  {children}
                </h3>
              ),

              /* Paragraph */
              p: ({ children }) => (
                <p className="text-[13.5px] leading-7 text-slate-200 mb-3 last:mb-0">
                  {children}
                </p>
              ),

              /* Unordered list */
              ul: ({ children }) => (
                <ul className="my-3 ml-5 list-disc space-y-1.5 marker:text-indigo-400">
                  {children}
                </ul>
              ),

              /* Ordered list */
              ol: ({ children }) => (
                <ol className="my-3 ml-5 list-decimal space-y-1.5 marker:text-indigo-400">
                  {children}
                </ol>
              ),

              /* List item */
              li: ({ children }) => (
                <li className="pl-1 text-[13.5px] leading-6 text-slate-200">
                  {children}
                </li>
              ),

              /* Bold */
              strong: ({ children }) => (
                <strong className="font-semibold text-white">
                  {children}
                </strong>
              ),

              /* Italic */
              em: ({ children }) => (
                <em className="text-slate-300 italic">
                  {children}
                </em>
              ),

              /* Blockquote */
              blockquote: ({ children }) => (
                <blockquote className="my-4 border-l-2 border-indigo-500/60 pl-4 text-slate-300 italic">
                  {children}
                </blockquote>
              ),

              /* Horizontal line */
              hr: () => (
                <hr className="my-5 border-white/[0.08]" />
              ),

              /* Links */
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-2 decoration-indigo-400/40 hover:decoration-indigo-300 transition-colors duration-200"
                >
                  {children}
                  <ExternalLink size={14} />
                </a>
              ),

              /* Code */
              code: ({ className, children }) => {
                const value = String(children).replace(/\n$/, "")

                /* Inline code */
                if (!className) {
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-pink-400">
                      {value}
                    </code>
                  )
                }

                const language = className?.replace("language-", "")

                return (
                  <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">

                    {/* Code header */}
                    <div className="flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                      <span className="uppercase text-xs text-slate-400">
                        {language || "code"}
                      </span>
                    </div>

                    {/* Code content */}
                    <pre className="overflow-x-auto p-4 text-[13px] leading-6">
                      <code className={className}>
                        {value}
                      </code>
                    </pre>

                  </div>
                )
              },

              /* Pre */
              pre: ({ children }) => (
                <>
                  {children}
                </>
              ),

              /* Table */
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto rounded-xl border border-white/[0.08]">
                  <table className="w-full text-left text-[13px]">
                    {children}
                  </table>
                </div>
              ),

              /* Table head */
              thead: ({ children }) => (
                <thead className="bg-white/[0.06] text-slate-100">
                  {children}
                </thead>
              ),

              /* Table heading */
              th: ({ children }) => (
                <th className="px-3 py-2.5 font-semibold border-b border-white/[0.08]">
                  {children}
                </th>
              ),

              /* Table cell */
              td: ({ children }) => (
                <td className="px-3 py-2.5 text-slate-300 border-b border-white/[0.06]">
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </Markdown>
        </div>
      </div>

      {/* Lightbox */}
      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">

          {/* Close Button */}
          <button
            onClick={() => setLightBox(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 cursor-pointer transition"
          >
            <X size={20} />
          </button>

          {/* Full Image */}
          <img
            src={lightBox}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />

        </div>
      )}
    </div>
  )
}

export default MessageBubble