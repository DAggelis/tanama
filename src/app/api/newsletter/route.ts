import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Το email είναι υποχρεωτικό' }, { status: 400 });
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
      },
      body: JSON.stringify({
        email: email,
        updateEnabled: true,
        // Αν έχεις το ID της λίστας σου από το Brevo, πρόσθεσέ το εδώ:
        // listIds: [2] 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo Error Detail:", errorData);
      return NextResponse.json({ error: errorData.message }, { status: response.status });
    }

    return NextResponse.json({ message: 'Επιτυχής εγγραφή!' }, { status: 200 });

  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json({ error: 'Κάτι πήγε στραβά' }, { status: 500 });
  }
}