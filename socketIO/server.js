// 创建服务器
var app=require('http').createServer();
var io=require('socket.io')(app);

// 保存用户名
var users=[];
// 监听客户端连接
io.on('connection',function(client){
    console.log('客户端连接成功');

    //保存当前的用户名
    var nowName='';
    // 是否是新人
    var isNewPerson=true;
    // 监听登录事件,接收昵称
    client.on('login',function(name){
        console.log(name);
        // 用户名是否存在
        for(var i=0;i<users.length;i++){
            if(name==users[i]){
                isNewPerson=false;
            }
        }

        // 如果是新人将用户名添加到数组中
        if(isNewPerson){
            users.push(name);
            nowName=name;
            // 用户名设置成功
            client.emit('loginSuccess',nowName);
            // 告诉其他人xxx已经上线
            io.sockets.emit('add',nowName);
        }else{
            //用户名已存在
            client.emit('loginError','')
        }
    })

    // 接收客户端的消息
    client.on('sendMessage',function(data){
        console.log('sendMessage:'+data);

        // 将消息发送给每一个客户端
        io.sockets.emit('receiveMessage',data);
    })
})
// 开启服务器
app.listen(8080);