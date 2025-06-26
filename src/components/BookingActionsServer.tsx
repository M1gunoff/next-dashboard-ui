import { getAuth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import FormContainer from "@/components/FormContainer";

type BookingActionsServerProps = {
  item: {
    id: number;
    endTime: string;
  };
};

const BookingActionsServer = async ({ item }: BookingActionsServerProps) => {
  const { userId, sessionClaims } = getAuth({ cookies: cookies() });
  const role = sessionClaims?.role as string;

  return (
    <div className="flex items-center gap-2">
      {role === "admin" && (
        <FormContainer table="equipment-booking" type="update" data={item} />
      )}
      {new Date(item.endTime) > new Date() && (
        <FormContainer table="equipment-booking" type="delete" id={item.id} />
      )}
    </div>
  );
};

export default BookingActionsServer; 