import agenteMovilidad from '../agente_movilidad.js';

export default {
  data() {
    return {
      agentNumber: '',
      agentPassword: '',
    };
  },
  methods: {
    async loginAgent() {
      if (!this.agentNumber || !this.agentPassword) {
        alert('El número de agente y la contraseña son obligatorios.');
        return;
      }

      try {
        const response = await agenteMovilidad.loginAgent(this.agentNumber, this.agentPassword);

        if (response.status === 200 && response.data.agente) {
          console.log('Login de agente exitoso:', response.data);

          // Guardar los datos del agente en localStorage
          localStorage.setItem('agente', JSON.stringify(response.data.agente));

          // Redirigir a la página de about
          this.$router.push('/about');
        } else {
          alert('Error en el login del agente. Verifica tus credenciales.');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  }
};
