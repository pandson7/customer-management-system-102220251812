const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CUSTOMERS_TABLE;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const { httpMethod, pathParameters, body, resource } = event;

    // Handle CORS preflight
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    let response;

    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.customerId) {
          response = await getCustomer(pathParameters.customerId);
        } else {
          response = await getAllCustomers();
        }
        break;
      case 'POST':
        response = await createCustomer(JSON.parse(body));
        break;
      case 'PUT':
        response = await updateCustomer(pathParameters.customerId, JSON.parse(body));
        break;
      case 'DELETE':
        response = await deleteCustomer(pathParameters.customerId);
        break;
      default:
        response = {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    return {
      ...response,
      headers: { ...corsHeaders, ...response.headers }
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};

async function getAllCustomers() {
  const params = {
    TableName: tableName
  };

  const result = await dynamodb.scan(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  };
}

async function getCustomer(customerId) {
  const params = {
    TableName: tableName,
    Key: { customerId }
  };

  const result = await dynamodb.get(params).promise();
  
  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Customer not found' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
}

async function createCustomer(customerData) {
  // Validate required fields
  if (!customerData.name || !customerData.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name and email are required' })
    };
  }

  // Check if email already exists
  const emailCheckParams = {
    TableName: tableName,
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': customerData.email
    }
  };

  const existingCustomer = await dynamodb.query(emailCheckParams).promise();
  if (existingCustomer.Items.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email already exists' })
    };
  }

  const customer = {
    customerId: uuidv4(),
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone || '',
    address: customerData.address || '',
    registrationDate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const params = {
    TableName: tableName,
    Item: customer
  };

  await dynamodb.put(params).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(customer)
  };
}

async function updateCustomer(customerId, customerData) {
  // Check if customer exists
  const existingCustomer = await getCustomer(customerId);
  if (existingCustomer.statusCode === 404) {
    return existingCustomer;
  }

  // Validate required fields
  if (!customerData.name || !customerData.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name and email are required' })
    };
  }

  // Check if email already exists for another customer
  const emailCheckParams = {
    TableName: tableName,
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': customerData.email
    }
  };

  const existingEmailCustomer = await dynamodb.query(emailCheckParams).promise();
  if (existingEmailCustomer.Items.length > 0 && existingEmailCustomer.Items[0].customerId !== customerId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email already exists' })
    };
  }

  const updateParams = {
    TableName: tableName,
    Key: { customerId },
    UpdateExpression: 'SET #name = :name, email = :email, phone = :phone, address = :address, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': customerData.name,
      ':email': customerData.email,
      ':phone': customerData.phone || '',
      ':address': customerData.address || '',
      ':updatedAt': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };

  const result = await dynamodb.update(updateParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes)
  };
}

async function deleteCustomer(customerId) {
  // Check if customer exists
  const existingCustomer = await getCustomer(customerId);
  if (existingCustomer.statusCode === 404) {
    return existingCustomer;
  }

  const params = {
    TableName: tableName,
    Key: { customerId }
  };

  await dynamodb.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Customer deleted successfully' })
  };
}
