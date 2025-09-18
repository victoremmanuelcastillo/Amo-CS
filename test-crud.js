const axios = require('axios');

const baseURL = 'http://localhost:4000';

async function testCRUD() {
  console.log('🚀 Iniciando pruebas CRUD...\n');

  try {
    // Test CRUD Usuarios
    console.log('=== TESTING USUARIOS ===');

    // CREATE Usuario
    console.log('1. Creando usuario...');
    const userResponse = await axios.post(`${baseURL}/usuario/add`, {
      email: 'test@example.com',
      full_name: 'Usuario Test',
      password_hash: 'hash123'
    });
    console.log('✅ Usuario creado:', userResponse.data);
    const userId = userResponse.data.id;

    // READ Usuarios
    console.log('2. Obteniendo usuarios...');
    const usersResponse = await axios.get(`${baseURL}/usuario/ver`);
    console.log('✅ Usuarios obtenidos:', usersResponse.data.length, 'usuarios');

    // UPDATE Usuario
    console.log('3. Actualizando usuario...');
    const updateUserResponse = await axios.put(`${baseURL}/usuario/update/${userId}`, {
      email: 'updated@example.com',
      full_name: 'Usuario Actualizado',
      password_hash: 'newhash123'
    });
    console.log('✅ Usuario actualizado:', updateUserResponse.data);

    // Test CRUD Alimentos
    console.log('\n=== TESTING ALIMENTOS ===');

    // CREATE Alimento
    console.log('1. Creando alimento...');
    const foodResponse = await axios.post(`${baseURL}/alimento/add`, {
      category: 'Frutas',
      name: 'Manzana'
    });
    console.log('✅ Alimento creado:', foodResponse.data);
    const foodId = foodResponse.data.id;

    // READ Alimentos
    console.log('2. Obteniendo alimentos...');
    const foodsResponse = await axios.get(`${baseURL}/alimento/ver`);
    console.log('✅ Alimentos obtenidos:', foodsResponse.data.length, 'alimentos');

    // UPDATE Alimento
    console.log('3. Actualizando alimento...');
    const updateFoodResponse = await axios.put(`${baseURL}/alimento/update/${foodId}`, {
      category: 'Frutas Rojas',
      name: 'Manzana Roja'
    });
    console.log('✅ Alimento actualizado:', updateFoodResponse.data);

    // Test CRUD Proveedores
    console.log('\n=== TESTING PROVEEDORES ===');

    // CREATE Proveedor
    console.log('1. Creando proveedor...');
    const providerResponse = await axios.post(`${baseURL}/proveedor/add`, {
      business_name: 'Distribuidora ABC',
      user_id: userId
    });
    console.log('✅ Proveedor creado:', providerResponse.data);
    const providerId = providerResponse.data.id;

    // READ Proveedores
    console.log('2. Obteniendo proveedores...');
    const providersResponse = await axios.get(`${baseURL}/proveedor/ver`);
    console.log('✅ Proveedores obtenidos:', providersResponse.data.length, 'proveedores');

    // UPDATE Proveedor
    console.log('3. Actualizando proveedor...');
    const updateProviderResponse = await axios.put(`${baseURL}/proveedor/update/${providerId}`, {
      business_name: 'Distribuidora XYZ',
      user_id: userId
    });
    console.log('✅ Proveedor actualizado:', updateProviderResponse.data);

    // DELETE operations
    console.log('\n=== TESTING DELETE OPERATIONS ===');

    console.log('1. Eliminando proveedor...');
    const deleteProviderResponse = await axios.delete(`${baseURL}/proveedor/delete/${providerId}`);
    console.log('✅ Proveedor eliminado:', deleteProviderResponse.data);

    console.log('2. Eliminando alimento...');
    const deleteFoodResponse = await axios.delete(`${baseURL}/alimento/delete/${foodId}`);
    console.log('✅ Alimento eliminado:', deleteFoodResponse.data);

    console.log('3. Eliminando usuario...');
    const deleteUserResponse = await axios.delete(`${baseURL}/usuario/delete/${userId}`);
    console.log('✅ Usuario eliminado:', deleteUserResponse.data);

    console.log('\n🎉 ¡Todas las pruebas CRUD completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

testCRUD();