const fs = require('fs')

const express = require('express')

const socket = require('socket.io')

const http = require('http')

const app = express()

const server = http.createServer(app)

const io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response){
    fs.readFile('./static/js/index.html', function(err, data){
        if(err){
            response.send(err)
        }else{
            response.writeHead(200,{'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
    console.log('User / logged in!')
})

io.sockets.on('connection', function(socket){

    socket.on('newUser', function(name){
        console.log(name + ' 님이 접속 하였습니다.')
        socket.name = name
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
    })

    socket.on('message', function(data){
        data.name = socket.name
        console.log(data)
        socket.broadcast.emit('update', data);
    })

    socket.on('disconnect', function(){
        console.log(socket.name + '님이 나가셨습니다.')
        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })

    console.log('user logged in')

    socket.on('send', function(data){
        console.log('전달된 메시지:', data.msg)
    })

    socket.on('disconnect', function(){
        console.log('접속 종료')
    })
})

server.listen(3000, function(){
    console.log('Server is running..')
})