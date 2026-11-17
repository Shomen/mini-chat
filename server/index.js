import {createServer} from 'node:http'
import StompServer from 'stomp-broker-js'

const server = createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('chat server is running')
})

const broker = new StompServer({
  server,
  path: '/stomp',
})

broker.subscribe('/app/chat', (body) => {
  broker.send('/topic/chat', {}, body)
})

server.listen(3001, '127.0.0.1', () => {
  console.log('Chat server: http://127.0.0.1:3001')
  console.log('STOMP endpoint: ws://127.0.0.1:3001/stomp')
})