// Utilidades de debug para el carrito
// Se pueden importar y usar en cualquier parte del código

export const debugUtils = {
  // Debug de login
  debugLogin: (userData: any) => {
    console.log('🔐 DEBUG LOGIN:');
    console.log('='.repeat(30));
    console.log('👤 Usuario logueado:', userData?.person_name || 'N/A');
    console.log('📧 Email:', userData?.email || 'N/A');
    console.log('👥 Perfil:', userData?.profile || 'N/A');
    console.log('🆔 ID Usuario:', userData?.user_id || 'N/A');
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(30));
  },

  // Debug de carga de carrito desde backend
  debugLoadCart: (cartData: any) => {
    console.log('🔄 DEBUG LOAD CART FROM BACKEND:');
    console.log('='.repeat(40));
    if (cartData && cartData.items) {
      console.log('📦 Productos cargados:', cartData.items.length);
      console.log('💰 Total venta:', cartData.total_venta);
      console.log('📅 Fecha venta:', cartData.fecha_venta);
      console.log('📋 Estado:', cartData.estado);
      console.log('📝 Productos:');
      cartData.items.forEach((item: any, index: number) => {
        console.log(`   ${index + 1}. ${item.name}: ${item.quantity} unidades - $${item.price}`);
      });
    } else {
      console.log('⚠️ No hay carrito en backend');
    }
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(40));
  },

  // Debug de localStorage
  debugLocalStorage: (action: string, cartItems: any[]) => {
    console.log(`💾 DEBUG LOCALSTORAGE (${action}):`);
    console.log('='.repeat(35));
    console.log('📦 Productos en localStorage:', cartItems.length);
    console.log('📝 Productos:');
    cartItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name}: ${item.quantity} unidades - $${item.price}`);
    });
    console.log('💰 Total:', cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(35));
  },

  // Debug de envío al backend
  debugSendToBackend: (endpoint: string, data: any) => {
    console.log(`📤 DEBUG SEND TO BACKEND (${endpoint}):`);
    console.log('='.repeat(40));
    console.log('🌐 Endpoint:', endpoint);
    console.log('📤 Datos enviados:');
    if (data.items) {
      console.log('   📦 Items:', data.items.length);
      data.items.forEach((item: any, index: number) => {
        console.log(`      ${index + 1}. ${item.name}: ${item.quantity} unidades - $${item.price}`);
      });
    } else {
      console.log('   📋 Datos:', data);
    }
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(40));
  },

  // Debug de respuesta del backend
  debugBackendResponse: (endpoint: string, response: any) => {
    console.log(`📥 DEBUG BACKEND RESPONSE (${endpoint}):`);
    console.log('='.repeat(40));
    console.log('🌐 Endpoint:', endpoint);
    console.log('📥 Respuesta:', response);
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(40));
  },

  // Debug de error
  debugError: (action: string, error: any) => {
    console.log(`❌ DEBUG ERROR (${action}):`);
    console.log('='.repeat(30));
    console.log('🚨 Error:', error);
    console.log('📋 Mensaje:', error?.message || 'Sin mensaje');
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(30));
  },

  // Debug de logout
  debugLogout: () => {
    console.log('🚪 DEBUG LOGOUT:');
    console.log('='.repeat(25));
    console.log('👤 Usuario cerrando sesión');
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(25));
  },

  // Debug de estado general
  debugStatus: () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    const cart = localStorage.getItem('web_beatty_cart');
    
    console.log('📊 DEBUG STATUS:');
    console.log('='.repeat(25));
    console.log('🔐 Token:', !!token);
    console.log('👤 Usuario:', !!user);
    console.log('🛒 Carrito:', !!cart);
    
    if (cart) {
      const cartData = JSON.parse(cart);
      console.log('📦 Productos en carrito:', cartData.length);
    }
    console.log('⏰ Hora:', new Date().toLocaleTimeString());
    console.log('='.repeat(25));
  }
};

// Función para activar/desactivar debug
let debugEnabled = true; // Habilitado temporalmente para debug

export const debugConfig = {
  enable: () => {
    debugEnabled = true;
    console.log('✅ Debug habilitado');
  },
  disable: () => {
    debugEnabled = false;
    console.log('❌ Debug deshabilitado');
  },
  isEnabled: () => debugEnabled
};

// Wrapper para ejecutar debug solo si está habilitado
export const debug = {
  login: (userData: any) => debugEnabled && debugUtils.debugLogin(userData),
  loadCart: (cartData: any) => debugEnabled && debugUtils.debugLoadCart(cartData),
  localStorage: (action: string, cartItems: any[]) => debugEnabled && debugUtils.debugLocalStorage(action, cartItems),
  sendToBackend: (endpoint: string, data: any) => debugEnabled && debugUtils.debugSendToBackend(endpoint, data),
  backendResponse: (endpoint: string, response: any) => debugEnabled && debugUtils.debugBackendResponse(endpoint, response),
  error: (action: string, error: any) => debugEnabled && debugUtils.debugError(action, error),
  logout: () => debugEnabled && debugUtils.debugLogout(),
  status: () => debugEnabled && debugUtils.debugStatus()
};
