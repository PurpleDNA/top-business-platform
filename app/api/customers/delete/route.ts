import { NextRequest, NextResponse } from "next/server";
import { deleteCustomer } from "@/app/services/customers";
import { revalidateTag } from "next/cache";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { status: "ERROR", error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteCustomer(customerId);

    if (result.status === "SUCCESS") {
      // Revalidate cache tags
      revalidateTag("customers");

      return NextResponse.json(
        { status: "SUCCESS", message: "Customer deleted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: "ERROR", error: result.error },
      { status: 500 }
    );
  } catch (error) {
    console.error("Delete customer API error:", error);
    return NextResponse.json(
      { status: "ERROR", error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
