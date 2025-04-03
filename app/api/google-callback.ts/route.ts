import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/google-callback'
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    const { tokens } = await client.getToken(code)
    
    // Store tokens securely (e.g., in a session or encrypted cookie)
    // For this example, we'll just send them back to the client
    return NextResponse.json(tokens)
  } catch (error) {
    console.error('Error getting tokens:', error)
    return NextResponse.json({ error: 'Failed to get tokens' }, { status: 400 })
  }
}
