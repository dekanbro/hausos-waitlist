import Airtable from 'airtable';
import { NextResponse } from 'next/server';

// Add type for error handling
interface AirtableError {
  message: string;
  statusCode?: number;
  error?: string;
  stack?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      throw new Error('Missing Airtable configuration');
    }

    const base = new Airtable({ apiKey }).base(baseId);

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check for existing email
    const existingRecords = await base('signups')
      .select({
        filterByFormula: `Email = '${email}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (existingRecords.length > 0) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }

    // Add debug logging
    console.log('Attempting to create record with:');
    console.log('Base ID:', baseId);
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    console.log('Email:', email);
    console.log('Table name: signups');

    const result = await base('signups').create([
      {
        fields: {
          Email: email,
          SignupDate: new Date().toISOString()
        }
      }
    ]);

    console.log('Airtable response:', result);

    return NextResponse.json(
      { message: 'Successfully subscribed' },
      { status: 200 }
    );
  } catch (error) {
    // Enhanced error logging
    console.error('Subscription error details:', {
      message: (error as AirtableError).message,
      statusCode: (error as AirtableError).statusCode,
      type: (error as AirtableError).error,
      stack: (error as AirtableError).stack
    });

    return NextResponse.json(
      { error: 'Failed to subscribe: ' + (error as AirtableError).message },
      { status: 500 }
    );
  }
} 