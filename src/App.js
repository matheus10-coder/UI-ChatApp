import {useEffect, useState} from "react";
import Pusher from 'pusher-js/react-native';

function App() {
  const [username, setUsername] = useState('username');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  let allMessages = [];
  
  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('aaf95a6a36f85a824662', {
      cluster: 'us2'
    });

    var channel = pusher.subscribe('chat');
    channel.bind('message', function(data) {
      allMessages.push(data);
      setMessages(allMessages);
    });

  }, []);

  const submit = async e => {
    e.preventDefault();

    await fetch('http://localhost:8000/api/messages',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username,
        message
      })
    });

    setMessage('');



  }

  return (
      <div className="container">
        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
            <div className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
              <input className="fs-5 fw-semibold" value={username} 
                onChange={e => setUsername(e.target.value)}/>
            </div>
            <div className="list-group list-group-flush border-bottom scrollarea">
              {messages.map(message => {
                return (
                  <div className="list-group-item list-group-item-action active py-3 lh-tight">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                      <strong className="mb-1">{message.username}</strong>
                    </div>
                    <div className="col-10 mb-1 small">{message.message}</div>
                  </div>
                )
              })}
            </div>
        </div>
        <form onSubmit={e => submit(e)}>
          <input className="form-control" placeholder="Write a message" value={message} 
            onChange={e => setMessage(e.target.value)}

          />
        </form>
      </div>
  );
}

export default App;
