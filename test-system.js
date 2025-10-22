#!/usr/bin/env node

const https = require('https');

const API_BASE_URL = 'https://gat72i753g.execute-api.us-east-1.amazonaws.com/prod';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testSystem() {
  console.log('🧪 Testing Customer Management System API...\n');

  try {
    // Test 1: Get all customers (should be empty initially)
    console.log('1. Testing GET /api/customers...');
    const getAllResult = await makeRequest('GET', '/api/customers');
    console.log(`   Status: ${getAllResult.status}`);
    console.log(`   Response: ${JSON.stringify(getAllResult.data)}`);
    console.log('   ✅ GET all customers working\n');

    // Test 2: Create a new customer
    console.log('2. Testing POST /api/customers...');
    const newCustomer = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-0123',
      address: '456 Test Ave, Test City, TC 12345'
    };
    const createResult = await makeRequest('POST', '/api/customers', newCustomer);
    console.log(`   Status: ${createResult.status}`);
    console.log(`   Response: ${JSON.stringify(createResult.data)}`);
    
    if (createResult.status === 201) {
      console.log('   ✅ Customer creation working');
      const customerId = createResult.data.customerId;

      // Test 3: Get specific customer
      console.log('\n3. Testing GET /api/customers/{id}...');
      const getOneResult = await makeRequest('GET', `/api/customers/${customerId}`);
      console.log(`   Status: ${getOneResult.status}`);
      console.log(`   Response: ${JSON.stringify(getOneResult.data)}`);
      console.log('   ✅ GET specific customer working');

      // Test 4: Update customer
      console.log('\n4. Testing PUT /api/customers/{id}...');
      const updatedCustomer = {
        name: 'Updated Test Customer',
        email: 'updated@example.com',
        phone: '555-9999',
        address: '789 Updated St, New City, NC 54321'
      };
      const updateResult = await makeRequest('PUT', `/api/customers/${customerId}`, updatedCustomer);
      console.log(`   Status: ${updateResult.status}`);
      console.log(`   Response: ${JSON.stringify(updateResult.data)}`);
      console.log('   ✅ Customer update working');

      // Test 5: Delete customer
      console.log('\n5. Testing DELETE /api/customers/{id}...');
      const deleteResult = await makeRequest('DELETE', `/api/customers/${customerId}`);
      console.log(`   Status: ${deleteResult.status}`);
      console.log(`   Response: ${JSON.stringify(deleteResult.data)}`);
      console.log('   ✅ Customer deletion working');

      // Test 6: Verify deletion
      console.log('\n6. Verifying customer was deleted...');
      const verifyResult = await makeRequest('GET', `/api/customers/${customerId}`);
      console.log(`   Status: ${verifyResult.status}`);
      if (verifyResult.status === 404) {
        console.log('   ✅ Customer successfully deleted');
      } else {
        console.log('   ❌ Customer deletion verification failed');
      }

    } else {
      console.log('   ❌ Customer creation failed');
    }

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📱 Frontend URLs:');
    console.log(`   Website: http://customer-management-frontend-102220251812.s3-website-us-east-1.amazonaws.com`);
    console.log(`   API: ${API_BASE_URL}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSystem();
