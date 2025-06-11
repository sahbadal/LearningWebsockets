import React from 'react'
import { useEffect } from 'react';
import { io } from 'socket.io-client'
import { Container, Typography, Button, TextField } from '@mui/material'
import { useState } from 'react';
import { useMemo } from 'react';

const App = () => {
  const socket = useMemo(() => io('http://localhost:5000'), [])
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  }

  useEffect(() => {

    socket.on("connect", () => {
      console.log("connected", socket.id);
    })


    socket.on("welcome", (s) => {
      console.log(s);

    })

    return () => {
      socket.disconnect()
    }

  }, [])

  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component='div' gutterBottom>
        Welcome to socket io
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id='oulined-basic'
          label='outlined'
          variant='outlined'
        />
        <Button type='submit' color='primary' variant='contained'>
          Submit
        </Button>
      </form>

    </Container>
  )
}

export default App