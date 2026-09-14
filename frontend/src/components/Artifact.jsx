
import { useSelector } from "react-redux"
import { Code2, PanelRightClose } from "lucide-react"
import { useState } from "react";
import { motion } from "motion/react"

function Artifact() {

  const { artifacts } = useSelector(state => state.message);
  const [collapsed , setCollapsed] = useState(false)

  if(collapsed){
    return (
      <motion.div
        initial={{opacity: 0}} // from
        animate={{opacity: 1}} // to

      >

      </motion.div>
    )
  }


  return (
    <div className='hidden lg:flex h-full w-[250px] border-l border-white/[0.06] flex-col overflow-hidden shrink-0'>
      <div className='flex flex-col h-full bg-[#0d0f14]'>
        <div className='h-14  px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0'>
          <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0' onClick={()=>setCollapsed(prev => !prev)}>
            <PanelRightClose size={20} />
          </button>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0 transition-colors duration-150 border-none cursor-pointer">
              <Code2 className="text-indigo-400" size={12} />
            </div>

            <div className="text-[13px] font-meidum text-slate-200 truncate">
              {artifacts[0]?.title?.charAt(0).toUpperCase() +
                artifacts[0]?.title?.slice(1)}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Artifact