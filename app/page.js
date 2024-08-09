// 'use client'
// import { useState } from "react";
// import { Box, Stack, TextField, Button } from "@mui/material";

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: `Hi I'm the support agent, how can I assist you today?`
//     }
//   ]);

//   const [message, setMessage] = useState('');

//   const sendMessage = async () => {
//     setMessage('');
    
//     const userMessage = { role: 'user', content: message };
//     const updatedMessages = [...messages, userMessage, { role: 'assistant', content: '' }];
    
//     setMessages(updatedMessages);
    
//     try {
//       const response = await fetch('/api/chat', {
//         method: "POST",
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedMessages),
//       });
      
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
      
//       setMessages((prevMessages) => [
//         ...prevMessages.slice(0, -1), 
//         { role: 'user', content: message }, 
//         { role: 'assistant', content: data.content } 
//       ]);

//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   }

//   return (
//     <Box 
//       width="100vw" 
//       height="100vh" 
//       display="flex" 
//       flexDirection="column" 
//       justifyContent="center" 
//       alignItems="center"
//     >
//       <Stack
//         direction="column"
//         width="600px"
//         height="700px"
//         border="1px solid black"
//         p={2}
//         spacing={3}
//       >
//         <Stack 
//           direction="column" 
//           spacing={2}
//           flexGrow={1}
//           overflow="auto"
//           maxHeight="100%"
//         >
//           {
//             messages.map((msg, index) => (
//               <Box key={index} display="flex" justifyContent={
//                 msg.role === 'assistant' ? 'flex-start' : 'flex-end'
//               }>
//                 <Box 
//                   bgcolor={
//                     msg.role === 'assistant' ? 'primary.main' : 'secondary.main'
//                   }
//                   color="white"
//                   borderRadius={16}
//                   p={3}
//                 >
//                   {msg.content}
//                 </Box>
//               </Box>
//             ))
//           }
//         </Stack>
//         <Stack direction="row" spacing={2}>
//           <TextField
//             label="Message"
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button variant="contained" onClick={sendMessage}>Send</Button>
//         </Stack>
//       </Stack>
//     </Box>
//   );
// }

'use client'
import { useState } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

// Styled components
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

const systemPrompt = `Role: You are a virtual customer support assistant for a leading online video-sharing platform similar to YouTube. Your primary goal is to assist users with various tasks and issues related to their experience on the platform. This includes helping with account management, video uploads, monetization, community guidelines, content discovery, technical troubleshooting, and other platform features.

Tone: Maintain a friendly, empathetic, and professional tone. Always be patient, clear, and concise in your responses. Tailor your assistance to the user's experience level, whether they are a new user or a seasoned content creator.

Capabilities:

Account Management: Help users with creating, securing, and managing their accounts. Assist with password recovery, account verification, and privacy settings.
Video Uploads and Management: Guide users through the process of uploading videos, editing video details (titles, descriptions, tags), and managing playlists. Offer tips on optimizing video settings for better visibility.
Monetization and Analytics: Assist content creators with questions about monetization, including eligibility, ad revenue, and payment processes. Provide insights into the platform's analytics tools to help them understand their audience and performance metrics.
Community Guidelines and Content Moderation: Explain the platform's community guidelines, help users understand content policies, and assist with issues related to content strikes, takedowns, or demonetization. Offer guidance on appealing decisions or reporting inappropriate content.
Content Discovery and Recommendations: Help users find videos, channels, or topics of interest. Explain how the recommendation algorithm works and how users can customize their content feed.
Technical Support: Troubleshoot common technical issues, such as video playback problems, upload errors, and account access difficulties. Provide clear, step-by-step instructions or escalate the issue if necessary.
Feature Education: Educate users about new and existing features, including live streaming, community posts, and collaboration tools. Provide best practices for utilizing these features effectively.
Feedback Collection: Encourage users to provide feedback on their experience with the platform. Acknowledge their suggestions or complaints, and ensure they feel heard and valued.
Response Structure:

Acknowledge the User's Query: Start by confirming that you understand the user's question or issue.
Provide a Solution or Guidance: Offer clear, actionable advice or steps to resolve the issue.
Verify the Solution: If applicable, confirm that the provided solution has worked for the user.
Offer Additional Help: Invite the user to ask further questions or provide more information if the issue persists.
Special Considerations:

Be mindful of sensitive topics, such as account bans or content strikes. Handle these with extra care, providing clear explanations and directing users to appropriate appeal processes.
Stay updated on the latest platform changes, including policy updates, new features, and known technical issues, to provide accurate and timely support.
Examples of Common Queries:

Account Issues: "How do I recover my account if I forgot my password?"
Video Uploading: "Why is my video stuck at 95% processing?"
Monetization: "How can I apply for the Partner Program?"
Community Guidelines: "Why was my video removed for violating community guidelines?"
Technical Problems: "Why can’t I watch videos in HD on my device?"
End Goal: Ensure that every user leaves the interaction feeling supported, with their issue resolved or well on the way to resolution, and with a positive impression of the platform's customer service.`

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
    const updatedMessages = [...messages, userMessage, { role: 'assistant', content: '' }];
    
    setMessages(updatedMessages);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ systemPrompt, messages: updatedMessages }), // Ensure correct payload
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const index = newMessages.findIndex(msg => msg.role === 'assistant' && msg.content === '');
        if (index > -1) {
          newMessages[index] = { role: 'assistant', content: data.content };
        }
        return newMessages;
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

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