import { NextRequest, NextResponse } from "next/server";
import { deleteProduction } from "@/app/services/productions";
import { revalidateTag } from "next/cache";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { productionId } = body;

    if (!productionId) {
      return NextResponse.json(
        { status: "ERROR", error: "Production ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteProduction(productionId);

    if (result.status === "SUCCESS") {
      // Revalidate cache tags
      revalidateTag("productions");
      revalidateTag("last10");

      return NextResponse.json(
        { status: "SUCCESS", message: "Production deleted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: "ERROR", error: result.error },
      { status: 500 }
    );
  } catch (error) {
    console.error("Delete production API error:", error);
    return NextResponse.json(
      { status: "ERROR", error: "Failed to delete production" },
      { status: 500 }
    );
  }
}
