import { View } from "react-native";
import BillCard from "../cards/BillCard";

export default function BillList({ bills }) {
  return (
    <View>
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </View>
  );
}
