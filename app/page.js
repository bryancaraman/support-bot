'use client';
import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
});

const MovingBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #74ebd5, #acb6e5)',
  backgroundSize: '200% 200%',
  animation: 'gradientAnimation 15s ease infinite',
  zIndex: -1,
  
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 0%' },
    '50%': { backgroundPosition: '100% 100%' },
    '100%': { backgroundPosition: '0% 0%' },
  },
});

const ChatBox = styled(Stack)({
  width: '600px', 
  height: '800px',  
  border: '1px solid #ced4da',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
});

const MessageBubble = styled(Box)(({ role }) => ({
  display: 'flex',
  justifyContent: role === 'assistant' ? 'flex-start' : 'flex-end',
  marginBottom: '8px',
  padding: '8px',
  borderRadius: '16px',
  maxWidth: '80%',
  alignSelf: role === 'assistant' ? 'flex-start' : 'flex-end',
  backgroundColor: role === 'assistant' ? '#AEB9CC' : '#007bff',
  color: '#ffffff',
}));

const InputContainer = styled(Stack)({
  padding: '8px',
  borderTop: '1px solid #ced4da',
  backgroundColor: '#f8f9fa',
});

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm the support agent, how can I assist you today?`
    }
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (message.trim() === '') return;
  
    const userMessage = { role: 'user', content: message };
    const updatedMessages = [...messages, userMessage];
  
    setMessages(updatedMessages);
    setMessage('');
  
    try {
      const messagesToSend = updatedMessages[0].role === 'assistant'
        ? updatedMessages.slice(1)
        : updatedMessages;
  
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: messagesToSend }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data.content },
      ]);
  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatContainer>
      <MovingBackground />
      <ChatBox
        direction="column"
        spacing={2}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          p={2}
        >
          {
            messages.map((msg, index) => (
              <MessageBubble key={index} role={msg.role}>
                {msg.content}
              </MessageBubble>
            ))
          }
        </Stack>
        <InputContainer direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: '4px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
          >
            Send
          </Button>
        </InputContainer>
      </ChatBox>
    </ChatContainer>
  );
}