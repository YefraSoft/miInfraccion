<template>
  <div class="dashboard">
    <div class="sidebar">
      <h2 class="fade-in-left">Opciones del Agente</h2>
      <ul>
        <li @click="showSection('registerInfraccion')" class="fade-in-left">Registrar Infracción</li>
        <li @click="showSection('misInfracciones')" class="fade-in-left">Mis Infracciones</li>
        <li @click="logout" class="fade-in-left">Cerrar Sesión</li>
      </ul>
    </div>

    <div class="content">
      <div class="header">
        <h1 class="animated-title">Bienvenido, Agente {{ agentName }}</h1>
        <p class="subtitle">Aquí puedes gestionar infracciones y consultar tus registros.</p>
        <div class="divider"></div>
      </div>

      <!-- Sección para registrar infracción -->
      <div v-if="activeSection === 'registerInfraccion'" class="fade-in">
        <h2>Registrar una Infracción</h2>
        <form @submit.prevent="registrarInfraccion" class="infraccion-form">
          
          <!-- Fila 1: Placas y Estado -->
          <div class="form-row">
            <div class="form-group">
              <label for="placas">Placas del Vehículo:</label>
              <input type="text" v-model="infraccion.placas" id="placas" required />
            </div>
            <div class="form-group">
              <label for="estado">Estado:</label>
              <select v-model="infraccion.estado" id="estado" required>
                <option value="" disabled>Selecciona un estado</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Nuevo León">Nuevo León</option>
              </select>
            </div>
          </div>

          <!-- Fila 2: Marca y Color -->
          <div class="form-row">
            <div class="form-group">
              <label for="marca">Marca:</label>
              <select v-model="infraccion.marca" id="marca" required>
                <option value="" disabled>Selecciona una marca</option>
                <option value="Toyota">Toyota</option>
                <option value="Ford">Ford</option>
                <option value="Nissan">Nissan</option>
              </select>
            </div>
            <div class="form-group">
              <label for="color">Color del Vehículo:</label>
              <input type="text" v-model="infraccion.color" id="color" required />
            </div>
          </div>

          <!-- Fila 3: Lugar y Fecha -->
          <div class="form-row">
            <div class="form-group">
              <label for="lugar">Lugar de la Infracción:</label>
              <input type="text" v-model="infraccion.lugar" id="lugar" required />
            </div>
            <div class="form-group">
              <label for="fecha">Fecha de la Infracción:</label>
              <input type="date" v-model="infraccion.fecha" id="fecha" required />
            </div>
          </div>

          <!-- Fila 4: Hora y Descripción -->
          <div class="form-row">
            <div class="form-group">
              <label for="hora">Hora de la Infracción:</label>
              <input type="time" v-model="infraccion.hora" id="hora" required />
            </div>
            <div class="form-group">
              <label for="descripcion">Descripción de la infracción:</label>
              <input type="text" v-model="infraccion.descripcion" id="descripcion" required />
            </div>
          </div>

          <!-- Botón para Registrar -->
          <div class="form-row">
            <button type="submit" class="cta-button">Registrar Infracción</button>
          </div>

        </form>
      </div>

      <!-- Sección para ver infracciones -->
      <div v-if="activeSection === 'misInfracciones'" class="fade-in">
        <h2>Mis Infracciones Registradas</h2>
        <ul v-if="infracciones.length > 0" class="infracciones-list">
          <li v-for="infraccion in infracciones" :key="infraccion.id" class="infraccion-item">
            <div class="infraccion-header">
              <strong>Infracción ID:</strong> {{ infraccion.id }}
            </div>
            <div class="infraccion-details">
              <p><strong>Placas:</strong> {{ infraccion.placas || 'No disponible' }}</p>
              <p><strong>Marca:</strong> {{ infraccion.marca || 'No disponible' }}</p>
              <p><strong>Color:</strong> {{ infraccion.color || 'No disponible' }}</p>
              <p><strong>Estado:</strong> {{ infraccion.estado || 'No disponible' }}</p>
              <p><strong>Lugar:</strong> {{ infraccion.lugar || 'No disponible' }}</p>
              <p><strong>Fecha:</strong> {{ infraccion.fecha ? formatFecha(infraccion.fecha) : 'No disponible' }}</p>
              <p><strong>Descripción:</strong> {{ infraccion.descripcion || 'No disponible' }}</p>
            </div>
            <button @click="notificarCiudadano(infraccion)" class="notify-button">Notificar</button>
            <button @click="eliminarInfraccion(infraccion.id)" class="delete-button">Eliminar esta infracción</button>

          </li>
        </ul>
        <p v-else>No has registrado infracciones aún.</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; {{ currentYear }} - Derechos reservados</p>
    </footer>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'AboutView',
  //ENTIDAD DE BD
  data() {
  return {
    agentName: 'Agente', 
    activeSection: 'registerInfraccion', 
    infraccion: {
      placas: '',
      estado: '',
      marca: '',
      color: '',
      lugar: '',
      fecha: '',
      hora: '',          // Asegúrate de tener este campo para la hora
      descripcion: '',
      ciudadano_id: null, // Añade ciudadano_id como null inicialmente
      vehiculo_id: null   // Añade vehiculo_id como null inicialmente
    },
    infracciones: [], 
    currentYear: new Date().getFullYear(), 
    agenteId: null 
  };
},
//SE EEJECUTA AL MONTAR EL COMPONENTE
  mounted() {
    const agente = JSON.parse(localStorage.getItem('agente'));
    if (agente && agente.numero_agente) {
      this.agentName = agente.numero_agente;
      this.agenteId = agente.id;
      this.fetchInfracciones();
    } else {
      this.$router.push('/login');
    }
  },
  //FUNCIONES
  methods: {
    showSection(section) {
      this.activeSection = section;
      if (section === 'misInfracciones') {
        this.fetchInfracciones();
      }
    },
    logout() {
      localStorage.removeItem('agente');
      this.$router.push('/login');
    },
    async registrarInfraccion() {
  try {
    const response = await axios.post('http://localhost:3000/api/infracciones/registrar', {
      agente_id: this.agenteId,
      ciudadano_id: this.infraccion.ciudadano_id || null,
      vehiculo_id: this.infraccion.vehiculo_id || null,
      lugar: this.infraccion.lugar,
      fecha: this.infraccion.fecha,
      hora: this.infraccion.hora,
      descripcion: this.infraccion.descripcion,
      placas: this.infraccion.placas,
      color: this.infraccion.color,
      estado: this.infraccion.estado,
      marca: this.infraccion.marca,
    });

    if (response.status === 201) {
      alert('Infracción registrada con éxito');
      this.infraccion = {}; // Reiniciar los campos de la infracción
      this.fetchInfracciones(); // Recargar las infracciones para mostrar la nueva
    }
  } catch (error) {
    console.error('Error al registrar la infracción:', error.response?.data || error.message);
    alert(`Error al registrar la infracción: ${error.response?.data?.mensaje || 'Inténtelo nuevamente.'}`);

    // Puedes mostrar más detalles si es necesario:
    if (error.response?.data?.error) {
      console.error('Detalles adicionales del error:', error.response.data.error);
    }
  }
}

,
async eliminarInfraccion(infraccionId) {
  console.log(`ID de infracción a eliminar: ${infraccionId}`); // Depuración
  try {
    const response = await axios.delete(`http://localhost:3000/api/infracciones/eliminar/${infraccionId}`);
    if (response.status === 200) {
      alert('Infracción eliminada con éxito');
      this.fetchInfracciones(); // Refresca la lista después de eliminar
    }
  } catch (error) {
    console.error('Error al eliminar la infracción:', error.response ? error.response.data : error.message);
    alert(`Error al eliminar la infracción: ${error.response?.data?.mensaje || error.message || 'Error desconocido'}`);
  }
}
,
//APARENTEMENTE BIEN
async fetchInfracciones() {
  try {
    const response = await axios.get(`http://localhost:3000/api/infracciones/agente/${this.agenteId}`);

    if (response.status === 200) {
      this.infracciones = response.data;
    }
  } catch (error) {
    console.error('Error al obtener infracciones:', error);
    alert('Error al cargar las infracciones.');
  }
},
    async notificarCiudadano(infraccion) {
      try {
        const response = await axios.post('http://localhost:3000/api/notificaciones/enviar', {
          placas: infraccion.placas,
          agente_id: this.agenteId,
          lugar: infraccion.lugar,
          descripcion: infraccion.descripcion,
          fecha: infraccion.fecha
        });

        if (response.status === 200) {
          alert('Notificación enviada al ciudadano.');
        }
      } catch (error) {
        console.error('Error al notificar al ciudadano:', error);
        alert('Error al enviar la notificación.');
      }
    },
    formatFecha(fecha) {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
};
</script>
<style scoped>

.delete-button {
  background-color: #ff4c4c;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.delete-button:hover {
  background-color: #e60000;
}
.dashboard {
  display: flex;
  width: 100%; /* Ocupa todo el ancho de la pantalla */
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 220px; /* Ajustar el ancho para que el contenido principal tenga más espacio */
  background-color: #f7f7f7;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  padding: 10px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  margin-bottom: 10px;
  text-align: center;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;
}

.sidebar ul li:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.content {
  flex: 1;
  padding: 30px; /* Ajustar el padding para centrar el contenido */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-left: 20px; /* Separación mínima de la barra lateral */
}

.header {
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #4c00ff, #64d0ff);
  color: white;
  padding: 30px 0;
  border-radius: 10px;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0;
}

.header p.subtitle {
  font-size: 1.2rem;
  color: #ffffff;
  margin-top: 10px;
}

.divider {
  width: 50%;
  height: 4px;
  background-color: white;
  margin: 20px auto;
  border-radius: 2px;
}

.infraccion-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
}

.cta-button {
  width: 99%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-top: 15px;
}

.cta-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.footer {
  background-color: green;
  color: white;
  text-align: center;
  padding: 7px;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.infracciones-list {
  list-style-type: none;
  padding: 0;
}

.infraccion-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.infraccion-header {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.infraccion-details p {
  margin: 5px 0;
}

.notify-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.notify-button:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  /* Para pantallas pequeñas, permite que el contenido se apile verticalmente */
  .dashboard {
    flex-direction: column;
    align-items: center;
  }

  .sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .content {
    max-width: 100%;
    margin-left: 0;
  }

  .form-row {
    flex-direction: column;
  }
  .dashboard {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.footer {
  background-color: green;
  color: white;
  text-align: center;
  padding: 10px;
  margin-top: 20px; /* Espacio entre el contenido y el footer */
  width: 100%;
}
}
</style>
