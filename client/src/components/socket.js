import io from 'socket.io-client'

const socket = io.connect(import.meta.env.VITE_APP_SERVER_URL);

export default socket;