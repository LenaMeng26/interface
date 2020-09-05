$(function(){
    // 与socket建立连接
    var socket=io('ws://localhost:8080');

    var name='';
    // 登录的实现
    $('.login-btn').click(function(){
        name=$('#loginName').val();
        if(name){
            // 向服务器发送昵称
            socket.emit('login',name);
        }else{
            alert('name不能为空!')
        }
    })

    // 登录成功
    socket.on('loginSuccess',function(msgName){
       console.log(msgName);//拿到的是昵称
        if(msgName==name){
            $('.login-wrap').hide('slow');
            $('.chat-wrap').show('slow');
       }else{
           alert('用户名不匹配');
       } 
    })
    // 登录失败
    socket.on('loginError',function(data){
        alert('昵称重复');
    })

    // 接收新登录用户的信息
    socket.on('add',function(data){
        console.log('add'+data);//拿到的是昵称
        var html=`<p>欢迎${data}加入群聊</p>`;
        $('.chat-con').append(html);
    })

    // 给发送按钮绑定事件,发送消息
    $('.sendBtn').click(function(){
        // 获取聊天内容
        var txt=$('#sendtxt').val();
        // 发送清空
        $('#sendtxt').val('')

        // 发送到服务器
        socket.emit('sendMessage',{nName:name,msg:txt})
    })

    // 接收到服务器发送的聊天信息
    socket.on('receiveMessage',function(data){
        console.log('receiveMessage:'+data);
        
        // 追加页面
        var html;
        if(data.nName==name){
            html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">' + data.msg + '</span></div>'
        }else{
            html = '<div class="chat-item item-left clearfix rela"><span class="abs uname">' + data.nName + '</span><span class="img fl"></span><span class="fl message">' + data.msg + '</span></div>'
        }
        $('.chat-con').append(html);
    })
})