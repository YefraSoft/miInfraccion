import axios from 'axios';

export default {
  async login() {
    if (!this.email || !this.password) {
      alert('El correo y la contraseña son obligatorios.');
      return;
    }
  
    console.log('Email:', this.email);
    console.log('Password:', this.password);  // Asegúrate de que la contraseña esté correctamente capturada
  
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email: this.email,
        password: this.password,
      });
  
      console.log('Inicio de sesión exitoso:', response.data);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      this.$router.push('/dashboard');  // Redirigir al dashboard después del login
  
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      alert('Error al iniciar sesión. Verifica tu correo y contraseña.');
    }
  }
  
};