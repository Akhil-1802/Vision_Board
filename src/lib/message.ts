

 async function saveMessage({chat,senderId,recieverId}:{chat : string,senderId : string,recieverId :string}){
    try {
         await fetch('http://localhost:3000/api/message', {
            method:'POST',
            headers : {'Content-Type':'application/json'},
            body: JSON.stringify({

                chat,
                recieverId,
                senderId,
            })
        });
  
  
      } catch (error) {
        console.error('Error sending message to API:', error);
      }
}

export default saveMessage