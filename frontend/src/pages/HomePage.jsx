
import { useChatStore } from "../store/useChatStore"
import { NoChatSelected } from "../componentes/NoChatSelected"
import { ChatContainer } from "../componentes/ChatContainer"
import { Sidebar } from "../componentes/Sidebar"

function HomePage() {
  const {selectedUser}= useChatStore()
  return(
   <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center h-full px-4 pt-20">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh - 13rem)]">
            <div className="flex h-[85vh] overflow-hidden rounded-lg">
               <Sidebar />
               {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
      </div>
    
   </div>
  )
}

export default HomePage