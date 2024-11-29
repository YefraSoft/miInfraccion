import axios from 'axios';

export default {
  async loginAgent(agentNumber, agentPassword) {
    try {
      const response = await axios.post('https://backendmiinfraccion-production.up.railway.app/api/agent/login', {
        numero_agente: agentNumber,
        password: agentPassword
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }
};
