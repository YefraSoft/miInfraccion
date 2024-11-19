import axios from 'axios';

export default {
  async register(nombre, email, password) {
    // Aquí verificas si los datos están completos con un console.log
    console.log('Datos a enviar:', nombre, email, password);  // Verifica que los datos se están pasando correctamente

    try {
      // Enviar solicitud POST al backend con axios
      const response = await axios.post('http://localhost:3000/api/users/create', {
        nombre: nombre,
        email: email,
        password: password
      });

      // Mostrar respuesta exitosa en la consola y en una alerta
      console.log('Registro exitoso:', response.data);
      alert('Usuario registrado con éxito');
      
    } catch (error) {
      // Manejo de errores y mostrar mensaje en caso de fallar
      console.error('Fallo en el registro:', error);
      alert('Error al registrar usuario');
    }
  }
};
