import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Fab,
  Collapse,
  CircularProgress,
  Alert,
  Avatar,
  useTheme,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Close,
  Minimize,
  Psychology,
  Person,
} from '@mui/icons-material';
import { buildApiUrl } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  position?: 'bottom-right' | 'bottom-left';
}

const ChatBot: React.FC<ChatBotProps> = ({ position = 'bottom-right' }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your aurora assistant. Ask me anything about northern lights, aurora tracking, or space weather!',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(buildApiUrl('/api/assistant/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: inputMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that request.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Unable to get response. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const positionStyles = {
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 1300,
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={8}
              sx={{
                width: { xs: '90vw', sm: 380 },
                height: isMinimized ? 60 : 500,
                maxHeight: '80vh',
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(132, 250, 176, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  background: 'linear-gradient(45deg, #84fab0 10%, #8fd3f4 90%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SmartToy />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Aurora Assistant
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => setIsMinimized(!isMinimized)}
                    sx={{ color: 'white', mr: 1 }}
                  >
                    <Minimize />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setIsOpen(false)}
                    sx={{ color: 'white' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={!isMinimized}>
                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    overflowY: 'auto',
                    maxHeight: 350,
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(132, 250, 176, 0.5)',
                      borderRadius: '2px',
                    },
                  }}
                >
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        mb: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        flexDirection: message.isUser ? 'row-reverse' : 'row',
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: message.isUser ? '#84fab0' : '#8fd3f4',
                        }}
                      >
                        {message.isUser ? <Person /> : <SmartToy />}
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          maxWidth: '70%',
                          bgcolor: message.isUser
                            ? 'rgba(132, 250, 176, 0.1)'
                            : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          border: `1px solid ${
                            message.isUser
                              ? 'rgba(132, 250, 176, 0.3)'
                              : 'rgba(255, 255, 255, 0.1)'
                          }`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'white',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            mt: 0.5,
                            display: 'block',
                          }}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#8fd3f4' }}>
                        <SmartToy />
                      </Avatar>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <CircularProgress size={20} sx={{ color: '#84fab0' }} />
                      </Box>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Input */}
                <Box sx={{ p: 2 }}>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 1,
                        bgcolor: 'rgba(255, 0, 0, 0.1)',
                        color: 'white',
                        '& .MuiAlert-icon': { color: 'white' },
                      }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  )}
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    maxRows={3}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about auroras..."
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#84fab0',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={sendMessage}
                            disabled={loading || !inputMessage.trim()}
                            sx={{
                              color: '#84fab0',
                              '&:hover': {
                                backgroundColor: 'rgba(132, 250, 176, 0.1)',
                              },
                              '&.Mui-disabled': {
                                color: 'rgba(255, 255, 255, 0.3)',
                              },
                            }}
                          >
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Collapse>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <Fab
        color="primary"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          background: 'linear-gradient(45deg, #84fab0 10%, #8fd3f4 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #72e6a0 10%, #7bc8f0 90%)',
          },
          boxShadow: '0 4px 20px rgba(132, 250, 176, 0.3)',
        }}
      >
        {isOpen ? <Close /> : <Psychology />}
      </Fab>
    </Box>
  );
};

export default ChatBot;