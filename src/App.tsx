import './App.css'

function App() {

  return (
    <main className='mx-auto max-w-xl p-6'>
      <h1 className='text-2xl font-bold text-blue-600'>
        Mini chat
      </h1>
      <section className='mt-4 overflow-hidden rounded-lg border border-gray-300'>
        <div className="h-80 overflow-y-auto p-4">
            <p className="text-gray-500">No messages yet</p>
        </div>
        <form onSubmit={(event) => event.preventDefault()} className='flex items-end gap-2 border-t border-gray-300 p-4'>
          <label htmlFor="message">Message</label>
          <input placeholder='Enter Message' type="text" className='w-full rounded border border-gray-300 px-3 py-2'/>
          <button type='submit'>Send</button>
        </form>    
      </section>
     
    </main>
  )
}

export default App
