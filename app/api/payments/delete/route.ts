import { NextRequest, NextResponse } from "next/server";
import { deletePayment } from "@/app/services/payments";
import { revalidateTag } from "next/cache";

export async function DELETE(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { status: "ERROR", error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const result = await deletePayment(paymentId);

    if (result.status === "SUCCESS") {
      revalidateTag("payments", {});
      revalidateTag("customers", {});
      revalidateTag("productions", {});
      revalidateTag("sales", {});
      return NextResponse.json({ status: "SUCCESS" }, { status: 200 });
    }

    return NextResponse.json(
      { status: "ERROR", error: result.error },
      { status: 500 }
    );
  } catch (error) {
    console.error("Delete payment API error:", error);
    return NextResponse.json(
      { status: "ERROR", error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
