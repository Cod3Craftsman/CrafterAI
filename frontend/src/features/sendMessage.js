
import api from '../../utils/axios.js'

async function sendMessage(payload) {
  try {
    const {data} = await api.post("/api/agent/chat" , payload)
    return data;
  } catch (error) {
    console.error("API ERROR:", error.response?.data);
    throw error;
  }
}

export default sendMessage