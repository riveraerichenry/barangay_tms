import { NextResponse } from "next/server";

export async function GET() {
  try {
    const officeApiUrl = process.env.OFFICE_API_URL;

    if (!officeApiUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "OFFICE_API_URL is not configured.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${officeApiUrl}/api/test-db`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Office API returned an error.",
          officeApi: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vercel successfully connected to the Office API.",
      officeApi: data,
    });
  } catch (error) {
    console.error("OFFICE API CONNECTION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to Office API.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}