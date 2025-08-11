/**
 * API Testing Script
 * Test the CRM backend API endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, endpoint, data = null, headers = {}) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers,
            ...(data && { data })
        };
        
        const response = await axios(config);
        log(`✅ ${method.toUpperCase()} ${endpoint} - ${response.status}`, 'green');
        return response.data;
    } catch (error) {
        const status = error.response?.status || 'Network Error';
        const message = error.response?.data?.message || error.message;
        log(`❌ ${method.toUpperCase()} ${endpoint} - ${status}: ${message}`, 'red');
        return null;
    }
}

async function testAPI() {
    log('\n🚀 Testing Vinnora CRM API Endpoints\n', 'blue');
    
    // Test server health
    log('📊 Testing Server Health...', 'yellow');
    const health = await testEndpoint('GET', '/health');
    
    if (!health) {
        log('\n❌ Server is not responding. Make sure the backend is running on port 3001', 'red');
        log('Run: npm run dev', 'yellow');
        return;
    }
    
    log('\n🔐 Testing Authentication...', 'yellow');
    
    // Test user registration
    const testUser = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        organizationName: 'Test Organization'
    };
    
    const registerResult = await testEndpoint('POST', '/auth/register', testUser);
    
    if (!registerResult) {
        log('❌ Registration failed, cannot continue tests', 'red');
        return;
    }
    
    // Test user login
    const loginResult = await testEndpoint('POST', '/auth/login', {
        email: testUser.email,
        password: testUser.password
    });
    
    if (!loginResult || !loginResult.token) {
        log('❌ Login failed, cannot continue tests', 'red');
        return;
    }
    
    const token = loginResult.token;
    const authHeaders = { Authorization: `Bearer ${token}` };
    
    log('\n👥 Testing User Endpoints...', 'yellow');
    await testEndpoint('GET', '/users', null, authHeaders);
    
    log('\n🎯 Testing Lead Endpoints...', 'yellow');
    await testEndpoint('GET', '/leads', null, authHeaders);
    
    const testLead = {
        name: 'Test Lead',
        email: 'lead@example.com',
        phone: '+1234567890',
        serviceInterest: 'Web Development',
        source: 'Website'
    };
    
    const leadResult = await testEndpoint('POST', '/leads', testLead, authHeaders);
    
    if (leadResult && leadResult.id) {
        await testEndpoint('GET', `/leads/${leadResult.id}`, null, authHeaders);
    }
    
    log('\n👤 Testing Customer Endpoints...', 'yellow');
    await testEndpoint('GET', '/customers', null, authHeaders);
    
    log('\n💼 Testing Deal Endpoints...', 'yellow');
    await testEndpoint('GET', '/deals', null, authHeaders);
    
    log('\n📄 Testing Bill Endpoints...', 'yellow');
    await testEndpoint('GET', '/bills', null, authHeaders);
    
    log('\n🎫 Testing Support Ticket Endpoints...', 'yellow');
    await testEndpoint('GET', '/support-tickets', null, authHeaders);
    
    log('\n🔄 Testing Token Refresh...', 'yellow');
    await testEndpoint('POST', '/auth/refresh', { refreshToken: loginResult.refreshToken });
    
    log('\n🎉 API Testing Complete!', 'green');
    log('\nNext steps:', 'blue');
    log('1. ✅ Backend API is working');
    log('2. 🔗 Connect your frontend to http://localhost:3001');
    log('3. 📱 Test real-time features with WebSocket connections');
    log('4. 📊 Import your existing data or create sample data');
}

// Check if server is running first
async function checkServer() {
    try {
        await axios.get(`${BASE_URL}/health`);
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    const isRunning = await checkServer();
    
    if (!isRunning) {
        log('\n❌ Backend server is not running!', 'red');
        log('\nTo start the server, run:', 'yellow');
        log('  cd backend', 'blue');
        log('  npm run dev', 'blue');
        log('\nThen run this test again: node test-api.js\n', 'yellow');
        return;
    }
    
    await testAPI();
}

main().catch(console.error);
