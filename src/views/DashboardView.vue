<template>
  <div class="dashboard">
    <div class="sidebar">
      <div class="dark-mode-toggle" @click="toggleDarkMode">
        <span v-if="isDarkMode">🌙</span>
        <span v-else>☀️</span>
      </div>

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
          </select>

          <label for="marca">Marca:</label>
          <select v-model="vehiculo.marca" id="marca" required>
            <option disabled value="">Selecciona una marca</option>
            <option value="Acura">Acura</option>
            <option value="Alfa Romeo">Alfa Romeo</option>
            <option value="Toyota">Toyota</option>
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

    <!-- Botón flotante de Report -->
    <div id="reportCircle" @click="toggleReportBot">🚩</div>
    <!-- Menú de opciones -->
    <div v-if="showReportBot" id="reportBot">
      <h3>¿Qué desea reportar?</h3>
      <button @click="openReportForm('Vehículo abandonado')">Vehículo abandonado</button>
      <button @click="openReportForm('Vehículo en mi cochera')">Vehículo en mi cochera</button>
    </div>

    <!-- Formulario del reporte -->
    <div v-if="showReportForm" class="report-form-modal">
      <div class="form-header">
        <h3>Reporte: {{ reportType }}</h3>
        <button @click="closeReportForm" class="close-button">✖</button>
      </div>
      <form @submit.prevent="submitReport">
        <label for="numeroExterior">Número Exterior:</label>
        <input type="text" id="numeroExterior" v-model="reportData.numeroExterior" required />

        <label for="numeroInterior">Número Interior:</label>
        <input type="text" id="numeroInterior" v-model="reportData.numeroInterior" />

        <label for="calle">Calle:</label>
        <input type="text" id="calle" v-model="reportData.calle" required />

        <label for="cp">Código Postal:</label>
        <input type="text" id="cp" v-model="reportData.cp" required />

        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" v-model="reportData.descripcion" rows="4" required></textarea>

        <button type="submit" class="cta-button">Enviar Reporte</button>
      </form>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; {{ currentYear }} {{ userName }} - Derechos reservados</p>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardView",
  data() {
    return {
      isDarkMode: false,
      userName: "Usuario",
      activeSection: "register",
      vehiculo: { placas: "", estado: "", marca: "", color: "" },
      vehiculos: [],
      currentYear: new Date().getFullYear(),
      ciudadanoId: null,
      showReportBot: false,
      showReportForm: false,
      reportType: "",
      reportData: {
        numeroExterior: "",
        numeroInterior: "",
        calle: "",
        cp: "",
        descripcion: "",
      },
    };
  },
  mounted() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.nombre) {
      this.userName = usuario.nombre;
      this.ciudadanoId = usuario.id;
      this.fetchVehiculos();
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    showSection(section) {
      this.activeSection = section;
      if (section === "myVehicles") {
        this.fetchVehiculos();
      }
    },
    logout() {
      localStorage.removeItem("usuario");
      this.$router.push("/login");
    },

    async registerVehicle() {
      try {
        const response = await axios.post(
          "https://backendmiinfraccion-production.up.railway.app/api/vehiculos/registrar",
          { ...this.vehiculo, ciudadano_id: this.ciudadanoId }
        );
        if (response.status === 201) {
          this.vehiculos.push({ ...this.vehiculo });
          this.vehiculo = { placas: "", estado: "", marca: "", color: "" };
          alert("Vehículo registrado con éxito");
        }
      } catch (error) {
        alert("Error al registrar el vehículo.");
      }
    },

    async fetchVehiculos() {
      try {
        const response = await axios.get(
          `https://backendmiinfraccion-production.up.railway.app/api/vehiculos/${this.ciudadanoId}`
        );
        if (response.status === 200) {
          this.vehiculos = response.data;
        }
      } catch (error) {
        alert("Error al cargar los vehículos.");
      }
    },

    async deleteVehicle(vehicleId) {
      try {
        const response = await axios.delete(
          `https://backendmiinfraccion-production.up.railway.app/api/vehiculos/eliminar/${vehicleId}`
        );
        if (response.status === 200) {
          this.vehiculos = this.vehiculos.filter(
            (vehiculo) => vehiculo.id !== vehicleId
          );
          alert("Vehículo eliminado con éxito");
        }
      } catch (error) {
        alert("Error al eliminar el vehículo.");
      }
    },
    toggleReportBot() {
      this.showReportBot = !this.showReportBot;
    },
    openReportForm(type) {
      this.reportType = type;
      this.showReportBot = false;
      this.showReportForm = true;
    },
    closeReportForm() {
      this.showReportForm = false;
      this.reportData = {
        numeroExterior: "",
        numeroInterior: "",
        calle: "",
        cp: "",
        descripcion: "",
      };
    },
    submitReport() {
      alert(`
        Reporte enviado:
        - Tipo: ${this.reportType}
        - Número Exterior: ${this.reportData.numeroExterior}
        - Número Interior: ${this.reportData.numeroInterior}
        - Calle: ${this.reportData.calle}
        - CP: ${this.reportData.cp}
        - Descripción: ${this.reportData.descripcion}
      `);
      this.closeReportForm();
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      const body = document.body;
      if (this.isDarkMode) {
        body.classList.add("dark-mode");
      } else {
        body.classList.remove("dark-mode");
      }
    },
  }
};
</script>
<style scoped>
.dark-mode-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #f44336, #ff9800);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dark-mode-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
}

/* Tema oscuro */
body.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

body.dark-mode .sidebar {
  background-color: #1e1e1e;
}

body.dark-mode .content {
  background-color: #1a1a1a;
}

body.dark-mode .vehicle-card {
  background-color: #2a2a2a;
  color: white;
}

body.dark-mode .cta-button {
  background-color: #bb86fc;
}

body.dark-mode .cta-button:hover {
  background-color: #7c4dff;
}

body.dark-mode .delete-button {
  background-color: #cf6679;
}

body.dark-mode .delete-button:hover {
  background-color: #b00020;
}



#reportCircle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #f44336, #ff5722);
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#reportCircle:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
}

/* Menú flotante */
#reportBot {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 250px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
  z-index: 1001;
  animation: fadeIn 0.3s ease;
}

#reportBot h3 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

#reportBot button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 10px;
  background: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

#reportBot button:hover {
  background: #0056b3;
}

/* Formulario del reporte */
.report-form-modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  width: 400px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1002;
  animation: slideIn 0.3s ease;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.form-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #f44336;
}

form label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #555;
}

form input,
form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
}

form input:focus,
form textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.cta-button {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cta-button:hover {
  background-color: #0056b3;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

form label {
  display: block;
  margin: 10px 0 5px;
}

form input,
form textarea {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.cta-button {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.cta-button:hover {
  background-color: #0056b3;
}

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
