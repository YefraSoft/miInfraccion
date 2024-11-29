<template>
  <div class="home">
    <div class="wrapper fadeInDown">
      <div id="formContent">

        <!-- Opciones de registro/login/agentes -->
        <div class="header-options">
          <div class="option cursor-pointer" @click="setActiveTab('login')">
            <h2 :class="{ 'active': activeTab === 'login', 'inactive': activeTab !== 'login' }">Login Ciudadanos</h2>
          </div>
          <div class="option cursor-pointer" @click="setActiveTab('register')">
            <h2 :class="{ 'active': activeTab === 'register', 'inactive': activeTab !== 'register' }">Registro Ciudadanos
            </h2>
          </div>
          <div class="option cursor-pointer" @click="setActiveTab('agent')">
            <h2 :class="{ 'active': activeTab === 'agent', 'inactive': activeTab !== 'agent' }">Agentes de Movilidad</h2>
          </div>
        </div>

        <!-- Icono -->
        <div class="fadeIn first">
          <img src="@/assets/infraccion.webp" id="icon" alt="User Icon" />
        </div>

        <!-- Formulario de Login -->
        <div v-if="activeTab === 'login'">
          <form v-on:submit.prevent="login">
            <input type="text" id="login" class="fadeIn second" name="login" placeholder="Correo electrónico"
              v-model="email">
            <input type="password" id="password" class="fadeIn third" name="password" placeholder="Password"
              v-model="password">
            <input type="submit" class="fadeIn fourth" value="LogIn">
          </form>
        </div>

        <!-- Formulario de Registro -->
        <div v-if="activeTab === 'register'">
          <form v-on:submit.prevent="register">
            <input type="text" id="register" class="fadeIn second" name="register" placeholder="Nombre"
              v-model="nombre">
            <input type="email" id="email" class="fadeIn third" name="email" placeholder="Email" v-model="email">
            <input type="password" id="password-register" class="fadeIn third" name="password-register"
              placeholder="Password" v-model="password">
            <input type="submit" class="fadeIn fourth" value="Registrar">
          </form>
        </div>

        <!-- Formulario para Agentes -->
        <div v-if="activeTab === 'agent'">
          <form v-on:submit.prevent="loginAgent">
            <input type="text" id="agent-number" class="fadeIn second" name="agent-number"
              placeholder="Número de Agente" v-model="agentNumber">
            <input type="password" id="agent-password" class="fadeIn third" name="agent-password"
              placeholder="Contraseña" v-model="agentPassword">
            <input type="submit" class="fadeIn fourth" value="Ingresar">
          </form>
        </div>

        <!-- Pie de página para recordar contraseña -->
        <div id="formFooter" v-if="activeTab === 'login'">
          <a class="underlineHover" href="#">Forgot Password?</a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import loginAgente from '../login_agente.js'; // Importa la función que maneja el login

export default {
  //CREACION DE DATOS
  data() {
    return {
      activeTab: 'login',
      email: '',   // Usamos email en lugar de usuario
      password: '',
      nombre: '',
      agentNumber: '',
      agentPassword: '',
    };
  },
  //METODO DE CAMBIO DE PESTAÑA
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    // Método para inicio de sesión de ciudadanos APARENTEMETE BIEN
    async login() {
      if (!this.email || !this.password) {
        alert('El correo y la contraseña son obligatorios.');
        return;
      }

      try {
        const response = await axios.post('https://backendmiinfraccion-production.up.railway.app/api/login', {
          email: this.email,
          password: this.password,
        });

        console.log('Inicio de sesión exitoso:', response.data);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

        // Verifica si no estás ya en la ruta del dashboard
        if (this.$route.path !== '/dashboard') {
          this.$router.push('/dashboard');  // Redirigir al dashboard después del login
        }

      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        alert('Error al iniciar sesión. Verifica tu correo y contraseña.');
      }
    },
    // Método para registrar ciudadanos
    async register() {
      if (!this.nombre || !this.email || !this.password) {
        alert('Todos los campos son obligatorios.');
        return;
      }
      try {
        const response = await axios.post('https://backendmiinfraccion-production.up.railway.app/api/users/create', {
          nombre: this.nombre,
          email: this.email,
          password: this.password,
        });

        if (response.status === 201) {
          alert('Usuario registrado con éxito.');
          this.nombre = '';
          this.email = '';
          this.password = '';
          this.setActiveTab('login');
        } else {
          alert('Error al registrar el usuario.');
        }
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error en el registro del usuario.');
      }
    },
    async loginAgent() {
      if (!this.agentNumber || !this.agentPassword) {
        alert('El número de agente y la contraseña son obligatorios.');
        return;
      }

      try {
        const response = await loginAgente.loginAgent(this.agentNumber, this.agentPassword);

        if (response.status === 200 && response.data.agente) {
          console.log('Login de agente exitoso:', response.data);
          localStorage.setItem('agente', JSON.stringify(response.data.agente));

          // Verifica si no estás ya en la ruta about
          if (this.$route.path !== '/about') {
            this.$router.push('/about');  // Redirigir a la página de about
          }
        } else {
          alert('Error en el login del agente. Verifica tus credenciales.');
        }
      } catch (error) {
        console.error('Error en el login del agente:', error.response?.data?.message || error.message);
        alert('Error en el login del agente. Verifica tus credenciales.');
      }
    }
  }
};
</script>


<style scoped>
/* Todo el estilo se mantiene igual */

html {
  background-color: #56baed;
}

body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}

a {
  color: #92badd;
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}

/* Nueva sección de opciones */
.header-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.option {
  flex: 1;
  text-align: center;
}

/* Cursor en forma de manita */
.cursor-pointer {
  cursor: pointer;
}

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}

/* FORM TYPOGRAPHY*/

input[type=button],
input[type=submit],
input[type=reset] {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover,
input[type=submit]:hover,
input[type=reset]:hover {
  background-color: #39ace7;
}

input[type=button]:active,
input[type=submit]:active,
input[type=reset]:active {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text],
input[type=password],
input[type=email] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text]:focus,
input[type=password]:focus,
input[type=email]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type=text]:placeholder,
input[type=password]:placeholder,
input[type=email]:placeholder {
  color: #cccccc;
}

/* ANIMATIONS */

.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;

  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

#icon {
  width: 60%;
}
</style>
