<template>
  <div class="dashboard">
    <div class="sidebar">
      <h2 class="fade-in-left">Opciones</h2>
      <ul>
        <li @click="showSection('register')" class="fade-in-left">Registrar Vehículo</li>
        <li @click="showSection('myVehicles')" class="fade-in-left">Mis Vehículos</li>
        <li @click="showSection('infracciones')" class="fade-in-left">Infracciones</li>
        <li @click="logout" class="fade-in-left">Cerrar Sesión</li>
      </ul>
    </div>

    <div class="content">
      <div class="header">
        <h1 class="animated-title">Bienvenido, {{ userName }} </h1>
        <p class="subtitle">Has iniciado sesión correctamente!</p>
        <div class="divider"></div>
      </div>

      <!-- Sección para registrar vehículo -->
      <div v-if="activeSection === 'register'" class="vehicle-section fade-in">
        <h2>Registrar Vehículo</h2>
        <form @submit.prevent="registerVehicle">
          <label for="placas">Placas:</label>
          <input type="text" v-model="vehiculo.placas" id="placas" required />

          <label for="estado">Estado:</label>
          <select v-model="vehiculo.estado" id="estado" required>
            <option disabled value="">Selecciona un estado</option>
            <option value="Aguascalientes">Aguascalientes</option>
            <option value="Baja California">Baja California</option>
            <option value="Jalisco">Jalisco</option>
            <!-- Añadir los otros estados aquí -->
          </select>

          <label for="marca">Marca:</label>
          <select v-model="vehiculo.marca" id="marca" required>
            <option disabled value="">Selecciona una marca</option>
            <option value="Acura">Acura</option>
            <option value="Alfa Romeo">Alfa Romeo</option>
            <option value="Toyota">Toyota</option>
            <!-- Añadir las demás marcas aquí -->
          </select>

          <label for="color">Color:</label>
          <input type="text" v-model="vehiculo.color" id="color" required />

          <button type="submit" class="cta-button">Registrar Vehículo</button>
        </form>
      </div>

      <!-- Sección para ver mis vehículos -->
      <div v-if="activeSection === 'myVehicles'" class="fade-in">
        <h2>Mis Vehículos</h2>
        <ul class="my-vehicles-list">
          <li v-for="vehiculo in vehiculos" :key="vehiculo.id" class="vehicle-card">
            <h3>{{ vehiculo.marca }}</h3>
            <p><strong>Color:</strong> {{ vehiculo.color }}</p>
            <p><strong>Placas:</strong> {{ vehiculo.placas }}</p>
            <p><strong>Estado:</strong> {{ vehiculo.estado }}</p>
            <button @click="deleteVehicle(vehiculo.id)" class="delete-button">Eliminar</button>
          </li>
        </ul>
      </div>

      <!-- Sección para ver infracciones -->
      <div v-if="activeSection === 'infracciones'" class="fade-in">
        <h2>Infracciones</h2>
        <p>Aquí puedes ver tus infracciones.</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; {{ currentYear }} {{ userName }} - Derechos reservados</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardView',
  data() {
    return {
      userName: 'Usuario',
      activeSection: 'register',
      vehiculo: {
        placas: '',
        estado: '',
        marca: '',
        color: ''
      },
      vehiculos: [],
      currentYear: new Date().getFullYear(),
      ciudadanoId: null
    };
  },
  mounted() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.nombre) {
      this.userName = usuario.nombre;
      this.ciudadanoId = usuario.id;
      this.fetchVehiculos();
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    showSection(section) {
      this.activeSection = section;
      if (section === 'myVehicles') {
        this.fetchVehiculos();
      }
    },
    logout() {
      console.log('Sesión cerrada');
      localStorage.removeItem('usuario');
      this.$router.push('/login');
    },
    async registerVehicle() {
      try {
        const response = await axios.post('http://localhost:3000/api/vehiculos/registrar', {
          ...this.vehiculo,
          ciudadano_id: this.ciudadanoId
        });

        if (response.status === 201) {
          this.vehiculos.push({ ...this.vehiculo });
          this.vehiculo = { placas: '', estado: '', marca: '', color: '' };
          alert('Vehículo registrado con éxito');
        }
      } catch (error) {
        console.error('Error al registrar vehículo:', error);
        alert('Error al registrar el vehículo.');
      }
    },
    async fetchVehiculos() {
      try {
        const response = await axios.get(`http://localhost:3000/api/vehiculos/${this.ciudadanoId}`);
        if (response.status === 200) {
          this.vehiculos = response.data;
        }
      } catch (error) {
        console.error('Error al obtener vehículos:', error);
        alert('Error al cargar los vehículos.');
      }
    },
    async deleteVehicle(vehicleId) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/vehiculos/eliminar/${vehicleId}`);
        if (response.status === 200) {
          this.vehiculos = this.vehiculos.filter(vehiculo => vehiculo.id !== vehicleId);
          alert('Vehículo eliminado con éxito');
        }
      } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        alert('Error al eliminar el vehículo.');
      }
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  flex-direction: row;
}

.sidebar {
  width: 250px;
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
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #4c00ff, #64d0ff);
  color: white;
  padding: 30px 0;
  border-radius: 10px;
}

.animated-title {
  font-size: 3rem;
  margin: 0;
}

.subtitle {
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

.fade-in {
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

form label {
  display: block;
  margin-top: 10px;
}

form input,
form select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.cta-button {
  margin-top: 15px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;
}

.cta-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.delete-button {
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #c0392b;
}

.my-vehicles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
}

.vehicle-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.vehicle-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
}

.vehicle-card h3 {
  font-size: 1.4rem;
  color: #007bff;
  margin-bottom: 10px;
}

.vehicle-card p {
  color: #333;
  margin: 5px 0;
}

.footer {
  background-color: green;
  color: white;
  text-align: center;
  padding: 10px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
