import { NextRequest, NextResponse } from "next/server";
import { deleteSale } from "@/app/services/sales";
import { revalidateTag } from "next/cache";

export async function DELETE(request: NextRequest) {
  try {
    const { saleId } = await request.json();

    if (!saleId) {
      return NextResponse.json(
        { status: "ERROR", error: "Sale ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteSale(saleId);

    if (result.status === "SUCCESS") {
      revalidateTag("sales", {});
      revalidateTag("customers", {});
      revalidateTag("productions", {});
      return NextResponse.json({ status: "SUCCESS" }, { status: 200 });
    }

    return NextResponse.json(
      { status: "ERROR", error: result.error },
      { status: 500 }
    );
  } catch (error) {
    console.error("Delete sale API error:", error);
    return NextResponse.json(
      { status: "ERROR", error: "Failed to delete sale" },
      { status: 500 }
    );
  }
}
