import axios from 'axios';

export default {
  async loginAgent(agentNumber, agentPassword) {
    try {
      const response = await axios.post('http://localhost:3000/api/agent/login', {
        numero_agente: agentNumber,
        password: agentPassword
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }
};
