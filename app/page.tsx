"use client";

import { useState } from "react";

interface DatabaseInfo {
  database_name: string;
  database_user: string;
  postgres_version: string;
  server_time: string;
}

interface TestResponse {
  success: boolean;
  message: string;
  database?: DatabaseInfo;
  error?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResponse | null>(null);

  async function testDatabase() {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("/api/test-db", {
        cache: "no-store",
      });

      const data: TestResponse = await response.json();

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: "Unable to contact the API.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Barangay TMS
          </h1>

          <p className="mt-2 text-gray-500">
            PostgreSQL Connection Test
          </p>

          <button
            type="button"
            onClick={testDatabase}
            disabled={loading}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Testing..."
              : "Test Database Connection"}
          </button>

          {result && (
            <div
              className={`mt-6 rounded-lg border p-5 ${
                result.success
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <h2
                className={`font-bold ${
                  result.success
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {result.success
                  ? "Database Connected"
                  : "Connection Failed"}
              </h2>

              <p className="mt-1 text-sm">
                {result.message}
              </p>

              {result.database && (
                <div className="mt-4 space-y-2 rounded-lg bg-white p-4 text-sm">
                  <p>
                    <strong>Database:</strong>{" "}
                    {result.database.database_name}
                  </p>

                  <p>
                    <strong>User:</strong>{" "}
                    {result.database.database_user}
                  </p>

                  <p>
                    <strong>Server Time:</strong>{" "}
                    {new Date(
                      result.database.server_time
                    ).toLocaleString()}
                  </p>

                  <p>
                    <strong>PostgreSQL:</strong>{" "}
                    {result.database.postgres_version}
                  </p>
                </div>
              )}

              {result.error && (
                <pre className="mt-4 overflow-auto rounded bg-white p-4 text-sm text-red-600">
                  {result.error}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}