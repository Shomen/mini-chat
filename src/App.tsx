import {useEffect, useRef, useState} from 'react'
import { Client } from '@stomp/stompjs'
import './App.css'

type ChatMessage = {
  id: string
  text: string
  sender: string
}

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState<string | null>(null)
  const clientRef = useRef<Client | null> (null)
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    if (displayName === null) return

    let active = true

    const client = new Client({
      brokerURL: 'ws://127.0.0.1:3001/stomp',
      reconnectDelay: 3000,

      onConnect: () => {
        if (!active) return

        client.subscribe('/topic/chat', (frame) => {
          if (!active) return

          try {
            const incoming: unknown = JSON.parse(frame.body)

            if (
              typeof incoming !== 'object' ||
              incoming === null ||
              !('id' in incoming) ||
              !('text' in incoming) ||
              !('sender' in incoming) ||
              typeof incoming.id !== 'string' ||
              typeof incoming.text !== 'string' ||
              typeof incoming.sender !== 'string'
            ) {
              return
            }

            const received: ChatMessage = {
              id: incoming.id,
              text: incoming.text,
              sender: incoming.sender,
            }

            setMessages((previous) => [...previous, received])
          } catch {
            console.error('Received an invalid chat message')
          }
        })

        setConnected(true)
      },

      onWebSocketClose: () => {
        if (active) setConnected(false)
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers.message)
      },
    })

    clientRef.current = client
    client.activate()

    return () => {
      active = false
      clientRef.current = null
      void client.deactivate()
    }
  }, [displayName])

  function handleSend() {
    const text = message.trim()
    const client = clientRef.current

    if (!text || displayName === null || !client?.connected) return

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      sender: displayName,
    }

    client.publish({
      destination: '/app/chat',
      body: JSON.stringify(newMessage),
    })

    setMessage('')
  }

  if (displayName === null) {
    return (
      <main className="mx-auto max-w-sm p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Join Mini Chat
        </h1>

        <p className="mt-2 text-gray-600">
          Enter your name or continue as a guest.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()

            const trimmedName = name.trim()
            if (!trimmedName) return

            setDisplayName(trimmedName)
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium"
            >
              Your name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              autoComplete="name"
              placeholder="Enter your name"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Join chat
          </button>

          <button
            type="button"
            onClick={() => setDisplayName('Guest')}
            className="w-full rounded border border-gray-300 px-4 py-2"
          >
            Continue as guest
          </button>
        </form>
      </main>
    )
  }// Display Null
  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold text-blue-600">
          Mini Chat
        </h1>
        <p className="mt-1 text-gray-600">
          Chatting as {displayName}
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <aside
          aria-labelledby="users-heading"
          className="rounded-lg border border-gray-300 p-4"
        >
          <h2 id="users-heading" className="font-semibold">
            Users
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Available users
          </p>

          <ul className="mt-4 space-y-2">
            <li className="wrap-break-word">
              {displayName}
              <span className="ml-2 text-sm text-gray-500">
                (you)
              </span>
            </li>
          </ul>
        </aside>

        <section
          aria-labelledby="chat-heading"
          className="min-w-0 overflow-hidden rounded-lg border border-gray-300"
        >
          <header className="border-b border-gray-300 p-4">
            <h2 id="chat-heading" className="font-semibold">
              Shared chat
            </h2>
            <p role="status" className="text-sm text-gray-500">
              {connected ? 'Connected' : 'Connecting…'}
            </p>
          </header>

          <div className="h-80 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-gray-500">
                No messages yet. Say hello!
              </p>
            ) : (
              <ul className="space-y-3">
                {messages.map((item) => (
                  <li
                    key={item.id}
                    className="wrap-break-word rounded-lg bg-blue-50 p-3"
                  >
                    <p className="text-sm font-semibold text-blue-700">
                      {item.sender}
                    </p>
                    <p className="whitespace-pre-wrap">{item.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSend()
            }}
            className="flex items-end gap-2 border-t border-gray-300 p-4"
          >
            <div className="min-w-0 flex-1">
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium"
              >
                Message
              </label>

              <input
                id="message"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message…"
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim() || !connected}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </section>
      </div>
    </main>
  ) // Return}
  

}//App

export default App
