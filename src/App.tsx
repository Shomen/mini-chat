import {useState} from 'react'
import './App.css'

type ChatMessage = {
  id: string
  text: string
}

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  
  function handleSend() {
    const text = message.trim()
    if(!text) return

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
    }

    setMessages(
      (prevsMessage) => [...prevsMessage,newMessage]
    )
    setMessage('')
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold text-blue-600">
        Mini chat
      </h1>
      <section className="mt-4 overflow-hidden rounded-lg border border-gray-300">
        
        <div className="h-80 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet</p>
            ) : (
              <ul>
                { 
                  messages.map((item) => (
                      <li key={item.id} className='wrap-break-word rounded bg-blue-50 p-2'>
                        {item.text}
                      </li>
                    )
                  )
                }
              </ul>
            )}
        </div>
        
        <form 
          onSubmit={(event) => {
            event.preventDefault() 
            handleSend()
          }} 
          className="flex items-end gap-2 border-t border-gray-300 p-4">

          <label htmlFor="message">Message</label>
          
          <input id='message' 
          value={message} 
          onChange={(event) => setMessage(event.target.value)} 
          placeholder='Enter Message' 
          type="text" 
          className='w-full rounded border border-gray-300 px-3 py-2'
          />
          <button type='submit'>Send</button>
        </form>    
      </section>
     
    </main>
  )
}

export default App
