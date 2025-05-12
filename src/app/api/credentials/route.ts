import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: GET request started');
    
    const response = await axios.get('https://issuer.humanity.org/credentials/list', {
      headers: {
        'X-API-Token': '1f6f7ca9-f9fd-4d00-bac0-5d763fb5cf34',
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
    
    console.log('API Route: GET request successful', response.status);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Route GET error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while processing the request',
        details: error.response?.data || {}
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: POST request started');
    
    const body = await request.json();
    const endpoint = body.endpoint;
    const payload = body.payload;
    
    console.log('API Route: Request data', { endpoint, payload });
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'endpoint is required' },
        { status: 400 }
      );
    }
    
    const response = await axios.post(`https://issuer.humanity.org${endpoint}`, payload, {
      headers: {
        'X-API-Token': '1f6f7ca9-f9fd-4d00-bac0-5d763fb5cf34',
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
    
    console.log('API Route: POST request successful', response.status);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Route POST error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: error.response?.data?.message || error.message || 'An error occurred while processing the request',
        details: error.response?.data || {}
      },
      { status: error.response?.status || 500 }
    );
  }
} 