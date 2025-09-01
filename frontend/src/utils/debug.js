// SCRIPT SIMPLE DE DEBUG PARA EL CARRITO
// Copiar y pegar en la consola del navegador

console.log('🛒 DEBUG SIMPLE DEL CARRITO');
console.log('='.repeat(40));

// ========================================
// 1. VERIFICAR ESTADO ACTUAL
// ========================================

function checkStatus() {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  const cart = localStorage.getItem('web_beatty_cart');
  
  console.log('\n📊 ESTADO ACTUAL:');
  console.log('🔐 Token:', !!token);
  console.log('👤 Usuario:', !!user);
  console.log('🛒 Carrito:', !!cart);
  
  if (cart) {
    const cartData = JSON.parse(cart);
    console.log('📦 Productos:', cartData.length);
    cartData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name}: ${item.quantity} unidades`);
    });
  }
}

// ========================================
// 2. FUNCIONES DE PRUEBA
// ========================================

// Probar carga desde backend
async function testLoad() {
  console.log('\n🔄 PROBANDO CARGA DESDE BACKEND...');
  
  if (typeof window.loadCartFromBackend === 'function') {
    try {
      await window.loadCartFromBackend();
      console.log('✅ Carga exitosa');
      checkStatus();
    } catch (error) {
      console.error('❌ Error:', error);
    }
  } else {
    console.log('❌ loadCartFromBackend no disponible');
  }
}

// Probar guardado en backend
async function testSave() {
  console.log('\n💾 PROBANDO GUARDADO EN BACKEND...');
  
  if (typeof window.saveCartToBackend === 'function') {
    try {
      await window.saveCartToBackend();
      console.log('✅ Guardado exitoso');
      checkStatus();
    } catch (error) {
      console.error('❌ Error:', error);
    }
  } else {
    console.log('❌ saveCartToBackend no disponible');
  }
}

// Probar flujo completo
async function testComplete() {
  console.log('\n🧪 PROBANDO FLUJO COMPLETO...');
  
  // 1. Verificar estado inicial
  console.log('1️⃣ Estado inicial:');
  checkStatus();
  
  // 2. Probar carga
  console.log('\n2️⃣ Probando carga...');
  await testLoad();
  
  // 3. Probar guardado
  console.log('\n3️⃣ Probando guardado...');
  await testSave();
  
  console.log('\n✅ Flujo completo terminado');
}

// ========================================
// 3. MONITOREO DE AXIOS
// ========================================

function setupMonitoring() {
  if (window.axios) {
    console.log('✅ Configurando monitoreo de Axios...');
    
    window.axios.interceptors.request.use((config) => {
      if (config.url && config.url.includes('localhost:8000')) {
        console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    });
    
    window.axios.interceptors.response.use((response) => {
      if (response.config.url && response.config.url.includes('localhost:8000')) {
        console.log(`📥 ${response.status} ${response.config.url}`);
      }
      return response;
    });
  }
}

// ========================================
// 4. EJECUCIÓN INICIAL
// ========================================

// Configurar monitoreo
setupMonitoring();

// Verificar estado inicial
checkStatus();

console.log('\n🎯 FUNCIONES DISPONIBLES:');
console.log('- checkStatus() - Ver estado actual');
console.log('- testLoad() - Probar carga desde backend');
console.log('- testSave() - Probar guardado en backend');
console.log('- testComplete() - Probar flujo completo');

console.log('\n📝 INSTRUCCIONES:');
console.log('1. Ejecuta: checkStatus() - Para ver estado');
console.log('2. Ejecuta: testLoad() - Para probar carga');
console.log('3. Ejecuta: testSave() - Para probar guardado');
console.log('4. Ejecuta: testComplete() - Para flujo completo');
