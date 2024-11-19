import axios from 'axios';

export default {
    async registerVehicle() {
        try {
          const usuario = JSON.parse(localStorage.getItem('usuario')); // Obtener el ciudadano logueado
          const vehiculo = {
            placas: this.vehiculo.placas,
            estado: this.vehiculo.estado,
            marca: this.vehiculo.marca,
            color: this.vehiculo.color,
            ciudadano_id: usuario.id  // Asociar el vehículo al ciudadano logueado
          };
      
          // Realizar la solicitud POST al backend
          const response = await axios.post('http://localhost:3000/api/vehiculos/registrar', vehiculo);
          
          // Limpiar el formulario después de registrar el vehículo
          this.vehiculo = { placas: '', estado: '', marca: '', color: '' };
          
          // Mostrar un mensaje de éxito
          alert(response.data.mensaje);
      
          // Actualizar la lista de vehículos si es necesario
          this.obtenerMisVehiculos();
          
        } catch (error) {
          console.error('Error al registrar el vehículo:', error);
          alert('Hubo un error al registrar el vehículo.');
        }
      }
}      