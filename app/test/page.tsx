"use client";

import { useState } from "react";
import { fetchSaleById } from "@/app/services/sales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TestPage() {
  const [saleId, setSaleId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchSaleById(saleId);
      setResult(data);
      console.log("Test Result:", data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Function/API</h1>
      <p className="text-muted-foreground mb-6">
        Currently testing:{" "}
        <code className="bg-muted px-2 py-1 rounded">fetchSaleById</code>
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Sale ID</label>
          <Input
            type="text"
            value={saleId}
            onChange={(e) => setSaleId(e.target.value)}
            placeholder="Enter sale ID"
            className="mb-2"
          />
        </div>

        <Button onClick={handleTest} disabled={loading || !saleId}>
          {loading ? "Loading..." : "Run Test"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-4">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-md">
            <p className="font-semibold">✓ Success!</p>
          </div>

          {result.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">₦{result[0]?.amount || 0}</p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Paid Status</p>
                  <p className="text-2xl font-bold">
                    {result[0]?.paid ? (
                      <span className="text-green-500">Paid</span>
                    ) : (
                      <span className="text-red-500">Unpaid</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <p className="font-semibold mb-2">Sale Details:</p>
                <div className="bg-background p-4 rounded space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale ID:</span>
                    <span className="font-mono text-sm">{result[0]?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer ID:</span>
                    <span className="font-mono text-sm">
                      {result[0]?.customer_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Production ID:</span>
                    <span className="font-mono text-sm">
                      {result[0]?.production_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created At:</span>
                    <span className="text-sm">
                      {new Date(result[0]?.created_at).toLocaleString()}
                    </span>
                  </div>
                  {result[0]?.remaining && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span className="font-semibold">
                        ₦{result[0]?.remaining}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="bg-muted p-4 rounded-md">
            <p className="font-semibold mb-2">Full Response:</p>
            <pre className="bg-background p-4 rounded overflow-auto max-h-96 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
