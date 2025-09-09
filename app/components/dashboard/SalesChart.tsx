// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const salesData = [
//   { name: "Mon", sales: 12000, debt: 8000 },
//   { name: "Tue", sales: 19000, debt: 7500 },
//   { name: "Wed", sales: 15000, debt: 9000 },
//   { name: "Thu", sales: 22000, debt: 6500 },
//   { name: "Fri", sales: 18000, debt: 7000 },
//   { name: "Sat", sales: 25000, debt: 5500 },
//   { name: "Sun", sales: 16000, debt: 8500 },
// ];

// export const SalesChart = () => {
//   return (
//     <Card className="col-span-2">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold">Weekly Sales & Customer Debt Trends</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={salesData}>
//             <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//             <XAxis
//               dataKey="name"
//               className="text-muted-foreground"
//               fontSize={12}
//             />
//             <YAxis
//               className="text-muted-foreground"
//               fontSize={12}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "hsl(var(--card))",
//                 border: "1px solid hsl(var(--border))",
//                 borderRadius: "6px"
//               }}
//             />
//             <Line
//               type="monotone"
//               dataKey="sales"
//               stroke="hsl(var(--primary))"
//               strokeWidth={3}
//               dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
//               name="Sales ($)"
//             />
//             <Line
//               type="monotone"
//               dataKey="debt"
//               stroke="hsl(var(--warning))"
//               strokeWidth={2}
//               strokeDasharray="5 5"
//               dot={{ fill: "hsl(var(--warning))", strokeWidth: 2, r: 3 }}
//               name="Customer Debt ($)"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };
