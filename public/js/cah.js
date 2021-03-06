const socket = io();
const {name, room}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log((Qs.parse(location.search, {ignoreQueryPrefix: true})));


//Copy the room id to clipboard when the "Copy Link" button is clicked.
const $copylink = document.getElementById('copy-link');
const _id = sessionStorage.getItem('id');
const $logout = document.getElementById('logout');
$copylink.addEventListener("click", (e) => {
    let $temp = $("<input>");
    $("#room-details").append($temp);
    $temp.val(_id).select();
    document.execCommand("copy");
    $temp.remove();
});

$logout.addEventListener("click", (e)=> {
    sessionStorage.removeItem('id');
    window.location.href='/';
});

const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messagesTemplateArea = document.getElementById('messageTemplateArea')

//Templates
const messageTemplate = document.getElementById('message-template').innerHTML

const autoscroll = () => {
    //New message element
    const $newMessage = $messagesTemplateArea.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible Height
    const visibleHeight = $messagesTemplateArea.offsetHeight

    //Height of messages container
    const containerHeight = $messagesTemplateArea.scrollHeight

    //How far have you scrolled?
    const scrollOffset = $messagesTemplateArea.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight<=scrollOffset){
        $messagesTemplateArea.scrollTop = $messagesTemplateArea.scrollHeight
    }
}

let toggler=[...document.getElementById('toggle').querySelectorAll('div')];
toggler.forEach(item=>{
    item.addEventListener('click', ()=>{
        if(item.textContent===toggler[0].textContent){
            document.getElementById('chat-section').style.zIndex='1';
            document.getElementById('detailsandstats').style.zIndex='5';
        }else if(item.textContent===toggler[1].textContent){
            document.getElementById('chat-section').style.zIndex='5';
            document.getElementById('detailsandstats').style.zIndex='1';
        }
    });
});

$messageForm.addEventListener('submit',(e)=>{

    e.preventDefault()
     
    $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    if(message === ''){
        $messageFormButton.removeAttribute('disabled')
        return console.log('Please enter a message.')
    }

    socket.emit('sendMessage', message, (error)=>{
    
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            console.log(error)
        }
    })
})

socket.emit('join',{name, room:_id}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
    console.log('Client joined to socket server.')
})

socket.on('roomData',({roomName, usersInRoom})=>{
    const html = Mustache.render(document.getElementById('sidebar-template').innerHTML, {
        roomName,
        usersInRoom
    })
    document.getElementById('detailsandstats').innerHTML = html
    document.getElementById('roomName').textContent=roomName;
    
})


socket.on('message',(message, sender)=>{
    const html = Mustache.render(messageTemplate,{
                                                    chat_message: true,
                                                    User: sender,
                                                    messageTime: moment(message.createdAt).format('h:mm a'),
                                                    messageDisplay:message.content
                                                })
    $messagesTemplateArea.insertAdjacentHTML('beforeend',html)
    autoscroll()
}) 

socket.on('toast',(toast)=>{
    const html = Mustache.render(messageTemplate,{
                                                    chat_toast: true,
                                                    toastDisplay: toast
                                                })
    $messagesTemplateArea.insertAdjacentHTML('beforeend',html)
    autoscroll()
}) 
